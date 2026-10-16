import { neon } from '@neondatabase/serverless'
import type { Purchase } from '#shared/types/paywall'

/*
  Хранилище тестовых покупок.

  В проде — Postgres в Vercel (Neon): переменную DATABASE_URL подставляет интеграция
  Storage, сам код ходит в базу по HTTP-драйверу, поэтому работает и в serverless.
  Локально переменной обычно нет — чтобы проект запускался без аккаунтов, покупки
  складываются в память процесса: данные живут до перезапуска dev-сервера.
  Режим один раз сообщается строкой в лог.

  Авторизации в задании нет, поэтому «пользователь» — это идентификатор устройства
  из httpOnly-куки (server/utils/device.ts).
*/

type Sql = ReturnType<typeof neon>

type PurchaseRow = {
  id: number | string
  offer_id: string
  created_at: string | Date
}

/** Строка подключения читается один раз: на ходу переменная окружения не меняется */
const DATABASE_URL = process.env.DATABASE_URL?.trim() ?? ''

let client: Sql | null = null
let schema: Promise<unknown> | null = null

/** Покупки в памяти: только для локального запуска без DATABASE_URL */
const memory: Array<Purchase & { deviceId: string }> = []
let memoryWarned = false

function warnMemoryMode(): void {
  if (memoryWarned) return
  memoryWarned = true
  console.warn(
    '[db] DATABASE_URL не задан — покупки пишутся в память и исчезнут при перезапуске. '
    + 'На Vercel база подключается из панели Storage (Neon).',
  )
}

/** Таблица создаётся при первом обращении — отдельных миграций в тестовом сервисе нет */
function ensureSchema(sql: Sql): Promise<unknown> {
  if (schema) return schema

  const created = sql.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id         SERIAL PRIMARY KEY,
      offer_id   TEXT        NOT NULL,
      device_id  TEXT        NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )
  `).catch((error: unknown) => {
    // Иначе отклонённый промис остался бы в schema навсегда и все запросы к БД
    // падали бы до перезапуска процесса — следующая попытка должна пробовать снова
    schema = null
    throw error
  })
  schema = created

  return created
}

/**
 * Клиент БД с готовой схемой или null — тогда покупки живут в памяти.
 * Оба обращения к хранилищу начинаются с этого вызова.
 */
async function getSql(): Promise<Sql | null> {
  if (!DATABASE_URL) {
    warnMemoryMode()
    return null
  }

  const sql = (client ??= neon(DATABASE_URL))
  await ensureSchema(sql)

  return sql
}

function toPurchase(row: PurchaseRow): Purchase {
  return {
    id: Number(row.id),
    offerId: row.offer_id,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

/** Сохраняет тестовую покупку и возвращает её так, как её увидит клиент */
export async function savePurchase(offerId: string, deviceId: string): Promise<Purchase> {
  const createdAt = new Date().toISOString()
  const sql = await getSql()

  if (!sql) {
    const purchase: Purchase = { id: memory.length + 1, offerId, createdAt }
    memory.push({ ...purchase, deviceId })
    return purchase
  }

  const rows = await sql.query(
    'INSERT INTO purchases (offer_id, device_id, created_at) VALUES ($1, $2, $3) RETURNING id, offer_id, created_at',
    [offerId, deviceId, createdAt],
  ) as PurchaseRow[]

  const row = rows[0]
  if (!row) {
    throw new Error('Postgres не вернул строку из INSERT ... RETURNING — покупка не записана')
  }

  return toPurchase(row)
}

/** Последняя покупка устройства — для ссылки «Восстановить покупки» */
export async function findLastPurchase(deviceId: string): Promise<Purchase | null> {
  const sql = await getSql()

  if (!sql) {
    const last = memory.findLast((purchase) => purchase.deviceId === deviceId)
    return last ? { id: last.id, offerId: last.offerId, createdAt: last.createdAt } : null
  }

  const rows = await sql.query(
    'SELECT id, offer_id, created_at FROM purchases WHERE device_id = $1 ORDER BY id DESC LIMIT 1',
    [deviceId],
  ) as PurchaseRow[]

  const row = rows[0]
  return row ? toPurchase(row) : null
}
