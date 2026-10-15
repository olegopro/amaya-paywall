import type { Offer, Purchase } from '#shared/types/paywall'

/*
  Данные для историй Storybook. Повторяют ответы server routes
  (server/utils/offers.ts и запись из таблицы purchases): у витрины нет
  ни Nuxt, ни сети, поэтому тарифы и покупка заданы здесь.
*/

export const offersFixture: Offer[] = [
  {
    id: 'monthly',
    title: 'Месяц',
    period: 'month',
    price: 299,
    months: 1,
    recommended: false,
    savingsPercent: null,
  },
  {
    id: 'yearly',
    title: 'Год',
    period: 'year',
    price: 1490,
    months: 12,
    recommended: true,
    savingsPercent: 58,
  },
]

export const purchaseFixture: Purchase = {
  id: 12,
  offerId: 'yearly',
  createdAt: '2026-10-16T09:24:00.000Z',
}
