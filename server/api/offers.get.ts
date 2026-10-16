import { offers } from '#shared/offers'
import type { OffersResponse } from '#shared/types/paywall'

/**
 * GET /api/offers — тарифы для экрана оплаты.
 * Цены и выгода заданы в shared/offers.ts, клиент их только показывает.
 */
export default defineEventHandler((): OffersResponse => ({ offers }))
