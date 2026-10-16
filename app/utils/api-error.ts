import type { ApiErrorBody } from '#shared/types/paywall'

const FALLBACK = 'Что-то пошло не так. Попробуйте ещё раз.'

/**
 * Текст ошибки для пользователя: server routes кладут его в message ответа
 * (см. apiError в server/utils/api-error.ts). Подстраховка — на случай ошибки,
 * до которой сервер не дошёл, например обрыва сети.
 */
export function readApiError(error: unknown): string {
  const body = (error as { data?: ApiErrorBody } | null)?.data
  return body?.message ?? FALLBACK
}
