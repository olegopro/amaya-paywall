import type { Offer } from '#shared/types/paywall'

/*
  Тарифы живут на сервере: клиент не присылает цену, а только id тарифа,
  и покупка проверяется по этому же списку (server/api/purchase.post.ts).
*/

const MONTHLY_PRICE = 299
const YEARLY_PRICE = 1490

/** Выгода годового тарифа против 12 месяцев по месячной цене — считается, а не вбивается руками */
const YEARLY_SAVINGS = Math.round((1 - YEARLY_PRICE / (MONTHLY_PRICE * 12)) * 100)

export const offers: Offer[] = [
  {
    id: 'monthly',
    title: 'Месяц',
    period: 'month',
    price: MONTHLY_PRICE,
    months: 1,
    recommended: false,
    savingsPercent: null,
  },
  {
    id: 'yearly',
    title: 'Год',
    period: 'year',
    price: YEARLY_PRICE,
    months: 12,
    // Год выбран при открытии экрана: он выгоднее, и с него начинается сценарий покупки
    recommended: true,
    savingsPercent: YEARLY_SAVINGS,
  },
]

/** Тариф по id или undefined — на undefined покупка отвечает 400 */
export function findOffer(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id)
}
