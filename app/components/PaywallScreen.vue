<script setup lang="ts">
import { computed } from 'vue'
import type {
  Offer,
  OffersStatus,
  Purchase,
  PurchaseStatus,
  RestoreStatus,
} from '#shared/types/paywall'
import OfferCard from '~/components/OfferCard.vue'
import OfferCardSkeleton from '~/components/OfferCardSkeleton.vue'
import PurchaseSuccess from '~/components/PurchaseSuccess.vue'
import { formatDate, formatPrice } from '~/utils/format'

/*
  Экран оплаты целиком: hero, карточки тарифов, кнопка покупки и состояния.
  Компонент презентационный — данные приходят в props, действия уходят в emit,
  поэтому любое состояние показывается в Storybook без Nuxt и без сети.
*/
const props = defineProps<{
  offers: Offer[]
  offersStatus: OffersStatus
  offersError: string
  selectedOfferId: string | null
  purchaseStatus: PurchaseStatus
  purchaseError: string
  donePurchase: Purchase | null
  restoreStatus: RestoreStatus
  restoreError: string
  restoredPurchase: Purchase | null
}>()

const emit = defineEmits<{
  select: [offerId: string]
  purchase: []
  retry: []
  restore: []
  reset: []
}>()

const selectedOffer = computed(
  () => props.offers.find((offer) => offer.id === props.selectedOfferId) ?? null,
)

const isBuying = computed(() => props.purchaseStatus === 'pending')
/** Пока идёт запрос — покупка или восстановление — кнопка недоступна: две операции разом не запускаются */
const canBuy = computed(() => props.offersStatus === 'ready'
  && selectedOffer.value !== null
  && !isBuying.value
  && props.restoreStatus !== 'pending')

const ctaLabel = computed(() => {
  if (isBuying.value) return 'Оформляем…'
  if (props.offersStatus === 'loading') return 'Загружаем тарифы…'
  if (props.offersStatus === 'error') return 'Тарифы недоступны'
  if (!selectedOffer.value) return 'Выберите тариф'
  return `Оформить за ${formatPrice(selectedOffer.value.price)}`
})

/** Покупка на этом устройстве лежит в donePurchase — тариф ищем по её id */
const doneOffer = computed(() => props.offers.find((offer) => offer.id === props.donePurchase?.offerId) ?? null)

const restoredTitle = computed(() => {
  const purchase = props.restoredPurchase
  if (!purchase) return ''
  return props.offers.find((offer) => offer.id === purchase.offerId)?.title ?? purchase.offerId
})

const restoreMessage = computed(() => {
  if (props.restoreStatus === 'found' && props.restoredPurchase) {
    return `Покупка восстановлена: тариф «${restoredTitle.value}» от ${formatDate(props.restoredPurchase.createdAt)}`
  }
  if (props.restoreStatus === 'not-found') return 'На этом устройстве покупок не найдено'
  return ''
})
</script>

<template>
  <PurchaseSuccess
    v-if="purchaseStatus === 'success' && donePurchase"
    :offer="doneOffer"
    :purchase="donePurchase"
    @reset="emit('reset')"
  />

  <div v-else class="paywall">
    <header class="hero">
      <div class="emblem" aria-hidden="true">
        <svg class="spark" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.6 14.6 9.4 21.4 12 14.6 14.6 12 21.4 9.4 14.6 2.6 12 9.4 9.4Z" fill="#fff" />
        </svg>
      </div>
      <h1 class="title">Открой полную игру</h1>
      <p class="lead">Все уровни, герои и награды. Без рекламы и без ожидания.</p>
    </header>

    <section class="offers" role="radiogroup" aria-label="Тарифы">
      <template v-if="offersStatus === 'loading'">
        <OfferCardSkeleton />
        <OfferCardSkeleton />
      </template>

      <div v-else-if="offersStatus === 'error'" class="error" role="alert">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.6 21.8 20.4H2.2Z" fill="currentColor" />
          <path d="M12 9.6v4.3" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="17.2" r="1.2" fill="#fff" />
        </svg>
        <p class="error-title">Не удалось загрузить тарифы</p>
        <p class="error-text">{{ offersError }}</p>
        <button type="button" class="retry" @click="emit('retry')">Повторить</button>
      </div>

      <template v-else>
        <OfferCard
          v-for="offer in offers"
          :key="offer.id"
          :offer="offer"
          :selected="offer.id === selectedOfferId"
          :disabled="isBuying || restoreStatus === 'pending'"
          @select="emit('select', offer.id)"
        />
      </template>
    </section>

    <footer class="footer">
      <p v-if="purchaseError" class="alert" role="alert">{{ purchaseError }}</p>

      <p v-if="restoreMessage" class="notice" :class="{ 'is-found': restoreStatus === 'found' }" role="status">
        {{ restoreMessage }}
      </p>

      <button type="button" class="cta" :disabled="!canBuy" :aria-busy="isBuying" @click="emit('purchase')">
        <span v-if="isBuying" class="spinner" aria-hidden="true" />
        {{ ctaLabel }}
      </button>

      <p v-if="selectedOffer" class="terms">
        {{ selectedOffer.title }} · {{ formatPrice(selectedOffer.price) }}
        {{ selectedOffer.period === 'year' ? 'в год' : 'в месяц' }}
      </p>

      <p v-if="restoreError" class="alert" role="alert">{{ restoreError }}</p>

      <button
        type="button"
        class="restore"
        :disabled="restoreStatus === 'pending' || purchaseStatus === 'pending' || offersStatus !== 'ready'"
        @click="emit('restore')"
      >
        {{ restoreStatus === 'pending' ? 'Восстанавливаем…' : 'Восстановить покупки' }}
      </button>

      <p class="legal">Тестовый сервис: деньги не списываются.</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
  .paywall {
    display: flex;
    // Экран заполняет окно приложения (app-shell / рамку витрины), а не задаёт высоту сам:
    // так кнопка покупки остаётся у нижнего края и ничего не вылезает за скруглённый угол
    flex: 1;
    flex-direction: column;
    gap: 22px;
    // safe-area — вырез камеры и «домашняя» полоса в webview
    padding: calc(24px + env(safe-area-inset-top)) 20px calc(14px + env(safe-area-inset-bottom));

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .emblem {
        display: flex;
        width: 76px;
        height: 76px;
        align-items: center;
        justify-content: center;
        background: linear-gradient(155deg, var(--brand-light) 0%, var(--brand) 45%, var(--brand-strong) 100%);
        border-radius: 24px;
        box-shadow: 0 14px 28px rgba(107, 75, 242, 0.32);
      }

      .spark {
        width: 40px;
        height: 40px;
      }

      .title {
        margin: 18px 0 0;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      .lead {
        max-width: 300px;
        margin: 8px 0 0;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.45;
        color: var(--text-muted);
      }
    }

    .offers {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 22px 18px;
      text-align: center;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);

      .error-icon {
        width: 34px;
        height: 34px;
        color: var(--danger);
      }

      .error-title {
        margin: 4px 0 0;
        font-size: 16px;
        font-weight: 800;
      }

      .error-text {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-muted);
      }
    }

    .retry {
      min-height: var(--tap-sm);
      margin-top: 10px;
      padding: 0 24px;
      font-size: 15px;
      font-weight: 800;
      color: var(--brand-strong);
      background: var(--brand-soft);
      border-radius: var(--radius-pill);
    }

    .footer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      // Кнопка покупки прижата к низу: её видно на любом экране без прокрутки
      margin-top: auto;
    }

    .alert,
    .notice {
      margin: 0;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 14px;
    }

    .alert {
      color: var(--danger);
      background: var(--danger-soft);
    }

    .notice {
      text-align: center;
      color: var(--text-muted);
      background: var(--surface-muted);

      &.is-found {
        color: var(--success);
        background: var(--success-soft);
      }
    }

    .cta {
      display: flex;
      width: 100%;
      min-height: var(--tap-lg);
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(180deg, var(--brand) 0%, var(--brand-strong) 100%);
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-cta);
      transition: transform 0.12s ease, opacity 0.15s ease;

      &:not(:disabled):active {
        transform: scale(0.985);
      }

      &:disabled {
        opacity: 0.55;
        box-shadow: none;
      }
    }

    .spinner {
      width: 18px;
      height: 18px;
      flex: none;
      border: 2.5px solid rgba(255, 255, 255, 0.45);
      border-top-color: #fff;
      border-radius: 50%;
      animation: paywall-spin 0.7s linear infinite;
    }

    .terms {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      color: var(--text-muted);
    }

    .restore {
      min-height: var(--tap-sm);
      font-size: 15px;
      font-weight: 800;
      color: var(--brand);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;

      &:disabled {
        color: var(--text-soft);
        text-decoration: none;
      }
    }

    .legal {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      color: var(--text-muted);
    }
  }

  @keyframes paywall-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
