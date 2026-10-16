/**
 * Ошибка server route: текст для пользователя уезжает в `message` — оттуда его читает
 * клиент (app/utils/api-error.ts), там же его видно в логах.
 *
 * Статус-текст короткий и латиницей: он попадает в HTTP-строку ответа, где кириллица недопустима.
 */
export function apiError(status: number, message: string, statusText = 'Bad request') {
  return createError({ status, message, statusText })
}
