/*
  Типы, общие для frontend и server routes (папка shared/ в Nuxt 4).
  Цены задаются на сервере: клиент присылает только id тарифа, а не цену.
*/
export interface Offer {
  /** Идентификатор тарифа, например 'monthly' */
  id: string
  /** Название тарифа для карточки: «Месяц», «Год» */
  title: string
  /** Период оплаты — по нему карточка выбирает подпись «в месяц» / «в год» */
  period: 'month' | 'year'
  /** Цена за период в рублях */
  price: number
  /** Длительность периода в месяцах — нужна для подписи «≈ 124 ₽ в месяц» */
  months: number
  /** Тариф по умолчанию: выбран на открытии экрана */
  recommended: boolean
  /** Выгода против месячной цены, в процентах; null — если выгоды нет */
  savingsPercent: number | null
}

/** Запись тестовой покупки из БД (offer_id, device_id, created_at) */
export interface Purchase {
  id: number
  offerId: string
  /** Момент покупки, ISO-строка */
  createdAt: string
}

/** Состояния экрана: их показывает PaywallScreen и ими управляет composable */
export type OffersStatus = 'loading' | 'ready' | 'error'
export type PurchaseStatus = 'idle' | 'pending' | 'error' | 'success'
export type RestoreStatus = 'idle' | 'pending' | 'found' | 'not-found'

export interface OffersResponse {
  offers: Offer[]
}

export interface PurchaseResponse {
  purchase: Purchase
}

export interface RestoreResponse {
  /** Нашлась ли покупка у этого устройства */
  restored: boolean
  purchase: Purchase | null
}

/** Тело ошибки, которое отдаёт createError из server route */
export interface ApiErrorBody {
  statusCode?: number
  statusMessage?: string
  data?: { message?: string }
}
