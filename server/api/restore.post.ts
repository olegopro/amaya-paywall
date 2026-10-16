import type { RestoreResponse } from '#shared/types/paywall'

/**
 * POST /api/restore — «Восстановить покупки»: последняя покупка этого устройства.
 * В настоящем приложении здесь запрос к магазину приложений, в тестовом — запрос к своей БД.
 */
export default defineEventHandler(async (event): Promise<RestoreResponse> => {
  const deviceId = ensureDeviceId(event)

  try {
    const purchase = await findLastPurchase(deviceId)
    return { restored: purchase !== null, purchase }
  } catch (error) {
    console.error('[restore] не удалось прочитать покупки устройства', error)
    throw apiError(500, 'Не удалось проверить покупки. Попробуйте ещё раз.', 'Restore failed')
  }
})
