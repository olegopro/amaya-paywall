import { defineNuxtConfig } from 'nuxt/config'

/*
  Frontend и server routes живут в одном приложении Nuxt:
  страница экрана — app/pages/index.vue, API — server/api/*, работа с БД — server/utils/db.ts.

  База — Postgres в Vercel (Neon): переменную DATABASE_URL подставляет интеграция Storage.
  Без неё server/utils/db.ts держит покупки в памяти процесса, поэтому локальный запуск
  не требует ни аккаунтов, ни ключей.
*/
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint'],
  devtools: { enabled: false },

  // Явная типизация: TS strict включён, отдельная проверка — командой npm run typecheck
  typescript: { strict: true, typeCheck: false },

  // Шрифт подключается пакетом, без обращения к CDN: webview игры может быть без интернета
  css: ['@fontsource-variable/nunito/index.css', '~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Полная версия — Amaya',
      meta: [
        { name: 'description', content: 'Тестовый paywall детской игры: два тарифа, оплата и восстановление покупок.' },
        // viewport-fit=cover — экран занимает всю высоту webview, включая вырезы и «домашнюю» полосу
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        // Тема светлая: тёмная автотема webview перекрасила бы фон и сломала контраст
        { name: 'color-scheme', content: 'light' },
        { name: 'theme-color', content: '#f5f2ff' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
