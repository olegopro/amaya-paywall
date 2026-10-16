import type { Offer } from '#shared/types/paywall'

/*
  Форматирование для экрана оплаты. Локаль задана явно: вывод на сервере
  и в браузере должен совпадать, иначе Vue ругается на несовпадение при гидратации.
*/

const priceFormatter = new Intl.NumberFormat('ru-RU')

/** 1490 → «1 490 ₽» */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} ₽`
}

/** 'year' → «в год», 'month' → «в месяц» */
export function formatPeriod(period: Offer['period']): string {
  return period === 'year' ? 'в год' : 'в месяц'
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

/** ISO-строка из БД → «16.10.2026» */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date)
}
