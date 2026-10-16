import type { PurchaseResponse } from '#shared/types/paywall'

/**
 * POST /api/purchase — тестовая покупка: запись в БД, ответ с id покупки.
 * Реального платёжного SDK нет: деньги не списываются, ключи не нужны.
 */
export default defineEventHandler(async (event): Promise<PurchaseResponse> => {
  // Валидатор только приводит тело к одной форме: пустое тело и не-строка дают пустой offerId,
  // а разбирается с ним та же ветка, что и с чужим тарифом — один путь ошибок
  const { offerId } = await readValidatedBody(event, (body: unknown) => {
    const value = (body as { offerId?: unknown } | null)?.offerId
    return { offerId: typeof value === 'string' ? value : '' }
  })

  // Тариф сверяется со списком на сервере: id, которого тут нет, — ошибка клиента
  const offer = findOffer(offerId)
  if (!offer) {
    throw apiError(400, 'Такого тарифа нет. Обновите экран и попробуйте снова.', 'Unknown offer')
  }

  const deviceId = ensureDeviceId(event)

  try {
    const purchase = await savePurchase(offer.id, deviceId)
    return { purchase }
  } catch (error) {
    console.error('[purchase] не удалось записать покупку в БД', error)
    throw apiError(500, 'Не удалось сохранить покупку. Попробуйте ещё раз.', 'Purchase failed')
  }
})
