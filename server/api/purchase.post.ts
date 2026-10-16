import type { PurchaseResponse } from '#shared/types/paywall'

/**
 * POST /api/purchase — тестовая покупка: запись в БД, ответ с id покупки.
 * Реального платёжного SDK нет: деньги не списываются, ключи не нужны.
 */
export default defineEventHandler(async (event): Promise<PurchaseResponse> => {
  // Тело проверяет readValidatedBody: пустое тело или offerId не строкой — сразу 400.
  // Текст для пользователя берётся из брошенной ошибки, её message обёртка сохраняет
  const { offerId } = await readValidatedBody(event, (body: unknown) => {
    const value = (body as { offerId?: unknown } | null)?.offerId

    if (typeof value !== 'string' || value.length === 0) {
      throw apiError(400, 'Не удалось прочитать тариф. Обновите экран и попробуйте снова.')
    }

    return { offerId: value }
  })

  // Тариф сверяется со списком на сервере: id, которого тут нет, — ошибка клиента
  const offer = findOffer(offerId)
  if (!offer) {
    throw apiError(400, 'Такого тарифа нет. Обновите экран и попробуйте снова.')
  }

  const deviceId = ensureDeviceId(event)

  try {
    const purchase = await savePurchase(offer.id, deviceId)
    return { purchase }
  } catch (error) {
    console.error('[purchase] не удалось записать покупку в БД', error)
    throw apiError(500, 'Не удалось сохранить покупку. Попробуйте ещё раз.')
  }
})
