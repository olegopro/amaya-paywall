import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PaywallScreen from '~/components/PaywallScreen.vue'
import { offersFixture, purchaseFixture } from '~/fixtures/offers'

/*
  Экран оплаты во всех состояниях, которые он умеет показывать:
  загрузка тарифов, ошибка загрузки, ошибка покупки и успех.
  Состояния переключаются аргументами в панели Controls — так же, как их
  переключает composable usePaywall в приложении.
*/
const meta = {
  title: 'Paywall/Экран',
  // id латиницей: заголовок на русском, а адрес истории должен оставаться читаемой ссылкой
  id: 'paywall-screen',
  component: PaywallScreen,
  args: {
    offers: offersFixture,
    offersStatus: 'ready',
    offersError: '',
    selectedOfferId: 'yearly',
    purchaseStatus: 'idle',
    purchaseError: '',
    donePurchase: null,
    restoreStatus: 'idle',
    restoreError: '',
    restoredPurchase: null,
  },
  argTypes: {
    offers: { control: 'object', description: 'Тарифы с сервера' },
    offersStatus: { control: 'select', options: ['loading', 'ready', 'error'] },
    offersError: { control: 'text', description: 'Текст ошибки загрузки тарифов' },
    selectedOfferId: { control: 'select', options: ['monthly', 'yearly', null] },
    purchaseStatus: { control: 'select', options: ['idle', 'pending', 'error', 'success'] },
    purchaseError: { control: 'text', description: 'Текст ошибки покупки' },
    donePurchase: { control: 'object', description: 'Сохранённая покупка — состояние успеха' },
    restoreStatus: { control: 'select', options: ['idle', 'pending', 'found', 'not-found'] },
    restoreError: { control: 'text', description: 'Текст ошибки запроса «Восстановить покупки»' },
    restoredPurchase: { control: 'object', description: 'Покупка, найденная при восстановлении' },
  },
} satisfies Meta<typeof PaywallScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Ready: Story = {
  name: 'Рабочий экран',
}

export const Loading: Story = {
  name: 'Загрузка тарифов',
  args: {
    offers: [],
    offersStatus: 'loading',
    selectedOfferId: null,
  },
}

export const OffersError: Story = {
  name: 'Ошибка загрузки тарифов',
  args: {
    offers: [],
    offersStatus: 'error',
    offersError: 'Сервис тарифов не отвечает. Проверьте соединение и попробуйте снова.',
    selectedOfferId: null,
  },
}

export const PurchaseError: Story = {
  name: 'Ошибка покупки',
  args: {
    purchaseStatus: 'error',
    purchaseError: 'Не удалось сохранить покупку. Попробуйте ещё раз.',
  },
}

export const PurchaseSuccess: Story = {
  name: 'Покупка оформлена',
  args: {
    purchaseStatus: 'success',
    donePurchase: purchaseFixture,
  },
}
