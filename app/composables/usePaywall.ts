import { computed, ref, watch } from 'vue'
import type {
  Offer,
  OffersResponse,
  OffersStatus,
  Purchase,
  PurchaseResponse,
  PurchaseStatus,
  RestoreResponse,
  RestoreStatus,
} from '#shared/types/paywall'
import { readApiError } from '~/utils/api-error'

/**
 * Состояние экрана оплаты и запросы к server routes.
 * Страница передаёт это состояние в PaywallScreen, а тот только рисует —
 * поэтому экран целиком показывается в Storybook без Nuxt и без сети.
 *
 * useFetch здесь не импортируется явно: это авто-импорт Nuxt, и файл живёт
 * только в приложении (в витрине его заменяют props).
 */
export async function usePaywall() {
  const { data, status, error, refresh: retryOffers } = await useFetch<OffersResponse>('/api/offers', {
    key: 'paywall-offers',
  })

  const offers = computed<Offer[]>(() => data.value?.offers ?? [])
  const offersStatus = computed<OffersStatus>(() => {
    if (status.value === 'pending') return 'loading'
    return status.value === 'error' ? 'error' : 'ready'
  })
  const offersError = computed(() => (error.value ? readApiError(error.value) : ''))

  const selectedOfferId = ref<string | null>(null)
  const selectedOffer = computed(() => offers.value.find((offer) => offer.id === selectedOfferId.value) ?? null)

  const purchaseStatus = ref<PurchaseStatus>('idle')
  const purchaseError = ref('')
  const donePurchase = ref<Purchase | null>(null)

  const restoreStatus = ref<RestoreStatus>('idle')
  const restoredPurchase = ref<Purchase | null>(null)

  // По умолчанию выбран тариф, помеченный сервером как рекомендуемый (год)
  watch(offers, (list) => {
    const stillThere = list.some((offer) => offer.id === selectedOfferId.value)
    if (stillThere) return
    selectedOfferId.value = list.find((offer) => offer.recommended)?.id ?? list[0]?.id ?? null
  }, { immediate: true })

  function selectOffer(id: string) {
    if (purchaseStatus.value === 'pending') return
    selectedOfferId.value = id
    // Прошлая ошибка относится к другому тарифу — после смены выбора она только путает
    purchaseStatus.value = 'idle'
    purchaseError.value = ''
  }

  async function buySubscription() {
    const offer = selectedOffer.value
    if (!offer || purchaseStatus.value === 'pending') return

    purchaseStatus.value = 'pending'
    purchaseError.value = ''

    try {
      const response = await $fetch<PurchaseResponse>('/api/purchase', {
        method: 'POST',
        body: { offerId: offer.id },
      })
      donePurchase.value = response.purchase
      purchaseStatus.value = 'success'
    } catch (requestError) {
      purchaseError.value = readApiError(requestError)
      purchaseStatus.value = 'error'
    }
  }

  async function restorePurchases() {
    if (restoreStatus.value === 'pending') return

    restoreStatus.value = 'pending'
    restoredPurchase.value = null

    try {
      const response = await $fetch<RestoreResponse>('/api/restore', { method: 'POST' })
      restoredPurchase.value = response.purchase
      restoreStatus.value = response.restored ? 'found' : 'not-found'
    } catch (requestError) {
      restoreStatus.value = 'not-found'
      purchaseError.value = readApiError(requestError)
    }
  }

  /** Возврат к тарифам с экрана успеха — в приложении здесь закрылось бы окно оплаты */
  function resetPaywall() {
    purchaseStatus.value = 'idle'
    purchaseError.value = ''
    donePurchase.value = null
    restoreStatus.value = 'idle'
    restoredPurchase.value = null
  }

  return {
    offers,
    offersStatus,
    offersError,
    selectedOfferId,
    selectedOffer,
    purchaseStatus,
    purchaseError,
    donePurchase,
    restoreStatus,
    restoredPurchase,
    retryOffers,
    selectOffer,
    buySubscription,
    restorePurchases,
    resetPaywall,
  }
}
