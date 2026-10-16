/**
 * Ошибка server route: текст для пользователя кладётся и в `message` (его видно в логах
 * и на странице ошибки Nuxt), и в `data.message` — это поле читает клиент
 * (app/utils/api-error.ts).
 */
export function apiError(status: number, message: string) {
  return createError({ status, message, data: { message } })
}
