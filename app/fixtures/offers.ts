import { offers } from '#shared/offers'
import type { Purchase } from '#shared/types/paywall'

/*
  Данные для историй Storybook: у витрины нет ни Nuxt, ни сети. Тарифы берутся те же,
  что отдаёт GET /api/offers (shared/offers.ts), покупка — образец строки из purchases.
*/

export const offersFixture = offers

export const purchaseFixture: Purchase = {
  id: 12,
  offerId: 'yearly',
  createdAt: '2026-10-16T09:24:00.000Z',
}
