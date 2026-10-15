import type { RestoreResponse } from '#shared/types/paywall'

/**
 * POST /api/restore — «Восстановить покупки»: последняя покупка этого устройства.
 * В настоящем приложении здесь запрос к магазину приложений, в тестовом — запрос к своей БД.
 */
export default defineEventHandler(async (event): Promise<RestoreResponse> => {
  const deviceId = ensureDeviceId(event)
  const purchase = await findLastPurchase(deviceId)

  return { restored: Boolean(purchase), purchase }
})
