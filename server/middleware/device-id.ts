/*
  Кука устройства ставится на первый же запрос страницы — то есть до того,
  как пользователь нажмёт «Оформить». К моменту покупки id уже есть и в куке,
  и в контексте запроса (server/utils/device.ts).
*/
export default defineEventHandler((event) => {
  ensureDeviceId(event)
})
