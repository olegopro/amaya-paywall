import type { Preview } from '@storybook/vue3-vite'

import '@fontsource-variable/nunito/index.css'
import '~/assets/css/main.css'
import './preview.css'

/**
 * Экран мобильный (360–430 px), поэтому история открывается в рамке телефона:
 * так в витрине видно то же, что увидит пользователь в webview игры.
 */
const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="sb-canvas"><div class="sb-phone"><story /></div></div>',
    }),
  ],
}

export default preview
