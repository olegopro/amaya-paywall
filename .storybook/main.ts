import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

const appDir = fileURLToPath(new URL('../app', import.meta.url))
const sharedDir = fileURLToPath(new URL('../shared', import.meta.url))

/**
 * Витрина экрана оплаты — вместо макета в Figma: те же компоненты, что в приложении.
 *
 * Своего vite.config у проекта нет (сборку ведёт Nuxt), поэтому Vue и алиасы Nuxt
 * (`~` и `@` → app/, `#shared` → shared/) подключаются здесь. Компоненты экрана
 * импортируют всё явно и не зависят от автоимпортов Nuxt — иначе витрина не собралась бы.
 */
const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../app/**/*.stories.ts'],
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  // Чек-лист «Get started» внизу боковой панели — обучение для нового проекта, в рабочей витрине лишний
  features: { sidebarOnboardingChecklist: false },
  viteFinal: (viteConfig) => mergeConfig(viteConfig, {
    plugins: [vue()],
    resolve: { alias: { '~': appDir, '@': appDir, '#shared': sharedDir } },
  }),
}

export default config
