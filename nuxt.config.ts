import { defineNuxtConfig } from 'nuxt/config'

/*
  Frontend и server routes в одном приложении Nuxt. База — Postgres в Vercel (Neon):
  DATABASE_URL подставляет интеграция Storage, без неё покупки живут в памяти процесса.
  TypeScript strict в Nuxt 4 включён по умолчанию, отдельная проверка — npm run typecheck.
*/
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint'],
  devtools: { enabled: false },

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
