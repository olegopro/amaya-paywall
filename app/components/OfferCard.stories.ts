import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OfferCard from '~/components/OfferCard.vue'
import { offersFixture } from '~/fixtures/offers'

const yearly = offersFixture[1]!

/*
  Карточка тарифа в двух состояниях: цена, бейдж выгоды и пересчёт на месяц
  считаются из данных тарифа — в Controls их видно целиком.
*/
const meta = {
  title: 'Paywall/Карточка тарифа',
  // id латиницей: заголовок на русском, а адрес истории должен оставаться читаемой ссылкой
  id: 'paywall-offer-card',
  component: OfferCard,
  args: { offer: yearly, selected: false, disabled: false },
  argTypes: {
    offer: { control: 'object', description: 'Тариф с сервера (GET /api/offers)' },
    selected: { control: 'boolean', description: 'Выбран ли тариф' },
    disabled: { control: 'boolean', description: 'Идёт запрос — карточка недоступна' },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="sb-inset"><story /></div>',
    }),
  ],
} satisfies Meta<typeof OfferCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Обычная',
}

export const Selected: Story = {
  name: 'Выбранная',
  args: { selected: true },
}
