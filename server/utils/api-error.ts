/**
 * Ошибка server route: текст для пользователя кладётся и в `message` (его видно в логах
 * и на странице ошибки Nuxt), и в `data.message` — это поле читает клиент
 * (app/utils/api-error.ts).
 *
 * Статус-текст короткий и латиницей: он уезжает в HTTP-строку ответа, где кириллица недопустима.
 */
export function apiError(status: number, message: string, statusText = 'Bad request') {
  return createError({ status, message, statusText, data: { message } })
}
