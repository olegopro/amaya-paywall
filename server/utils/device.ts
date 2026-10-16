import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

/*
  Идентификатор устройства для тестовой покупки. Куку ставит сервер на первом запросе,
  которому нужен пользователь (покупка или восстановление); значение недоступно
  из JavaScript — для тестового сервиса этого достаточно вместо входа в аккаунт.
*/

const DEVICE_COOKIE = 'device_id'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Кука на год: устройство в webview игры живёт долго, восстанавливать покупку нужно и через месяцы */
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  // Локальный http не отдаёт secure-куку, поэтому флаг включается только в проде
  secure: process.env.NODE_ENV === 'production',
}

/**
 * Возвращает id устройства из куки, а если её нет или формат не тот — новый,
 * который сразу уезжает клиенту в set-cookie.
 *
 * Проверка формата — гигиена, а не защита: произвольная строка в БД не уедет,
 * но чужой валидный UUID проверку пройдёт.
 */
export function ensureDeviceId(event: H3Event): string {
  const fromCookie = getCookie(event, DEVICE_COOKIE)
  const deviceId = fromCookie && UUID.test(fromCookie) ? fromCookie : randomUUID()

  if (deviceId !== fromCookie) setCookie(event, DEVICE_COOKIE, deviceId, COOKIE_OPTIONS)

  return deviceId
}
