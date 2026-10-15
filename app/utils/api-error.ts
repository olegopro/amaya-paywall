import type { ApiErrorBody } from '#shared/types/paywall'

const FALLBACK = 'Что-то пошло не так. Попробуйте ещё раз.'

/**
 * Текст ошибки для пользователя. Server routes кладут его в data.message
 * (см. createError в server/api/*), остальное — подстраховка на случай другой ошибки.
 */
export function readApiError(error: unknown): string {
  const body = (error as { data?: ApiErrorBody } | null)?.data
  return body?.data?.message ?? FALLBACK
}
