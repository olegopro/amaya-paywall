import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

/*
  Идентификатор устройства для тестовой покупки. Куку ставит сервер, значение
  недоступно из JavaScript — для тестового сервиса этого достаточно вместо входа в аккаунт.
*/

export const DEVICE_COOKIE = 'device_id'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Кука на год: устройство в webview игры живёт долго, восстанавливать покупку нужно и через месяцы */
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    // Локальный http не отдаёт secure-куку, поэтому флаг включается только в проде
    secure: process.env.NODE_ENV === 'production',
  }
}

/**
 * Возвращает id устройства: из контекста запроса, из куки или новый — новый сразу
 * уезжает клиенту в set-cookie.
 *
 * Проверка формата куки — гигиена, а не защита: произвольная строка в БД не уедет,
 * но чужой валидный UUID проверку пройдёт. В контексте запроса значение уже проверено
 * при выдаче, повторно его смотреть незачем.
 */
export function ensureDeviceId(event: H3Event): string {
  const fromContext = event.context.deviceId
  if (typeof fromContext === 'string') return fromContext

  const fromCookie = getCookie(event, DEVICE_COOKIE)
  const deviceId = fromCookie && UUID.test(fromCookie) ? fromCookie : randomUUID()

  if (deviceId !== fromCookie) setCookie(event, DEVICE_COOKIE, deviceId, cookieOptions())

  event.context.deviceId = deviceId
  return deviceId
}
