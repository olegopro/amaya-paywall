import type { PurchaseResponse } from '#shared/types/paywall'

/**
 * POST /api/purchase — тестовая покупка: запись в БД, ответ с id покупки.
 * Реального платёжного SDK нет: деньги не списываются, ключи не нужны.
 */
export default defineEventHandler(async (event): Promise<PurchaseResponse> => {
  const body = await readBody<{ offerId?: unknown }>(event).catch(() => null)
  const offerId = typeof body?.offerId === 'string' ? body.offerId : ''

  // Тариф сверяется со списком на сервере: id, которого тут нет, — ошибка клиента
  const offer = findOffer(offerId)
  if (!offer) {
    throw createError({
      statusCode: 400,
      // statusMessage уезжает в HTTP-заголовок, поэтому он латиницей; текст для пользователя — в data
      statusMessage: 'Unknown offer',
      data: { message: 'Такого тарифа нет. Обновите экран и попробуйте снова.' },
    })
  }

  const deviceId = ensureDeviceId(event)

  try {
    const purchase = await savePurchase(offer.id, deviceId)
    return { purchase }
  } catch (error) {
    console.error('[purchase] не удалось записать покупку в БД', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Purchase failed',
      data: { message: 'Не удалось сохранить покупку. Попробуйте ещё раз.' },
    })
  }
})
