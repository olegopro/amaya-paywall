import { computed, ref } from 'vue'
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
 * только в приложении (в витрине его заменяют props). Ожидание ответа не задерживает
 * setup: пока тарифы едут, экран показывает заглушки, а страница остаётся синхронной.
 */
export function usePaywall() {
  const { data, status, error, refresh: retryOffers } = useFetch<OffersResponse>('/api/offers', {
    key: 'paywall-offers',
  })

  const offers = computed<Offer[]>(() => data.value?.offers ?? [])
  const offersStatus = computed<OffersStatus>(() => {
    if (status.value === 'pending') return 'loading'
    return status.value === 'error' ? 'error' : 'ready'
  })
  const offersError = computed(() => (error.value ? readApiError(error.value) : ''))

  /** Явный выбор пользователя; пока его нет, действует тариф по умолчанию */
  const chosenOfferId = ref<string | null>(null)

  /*
    Выбранный тариф — величина вычисляемая, а не следствие наблюдателя: так он верно
    рисуется и на сервере (в HTML сразу есть выбранная карточка), и на клиенте.
    По умолчанию берётся тариф, помеченный сервером как рекомендуемый (год).
  */
  const selectedOffer = computed(
    () => offers.value.find((offer) => offer.id === chosenOfferId.value)
      ?? offers.value.find((offer) => offer.recommended)
      ?? offers.value[0]
      ?? null,
  )
  const selectedOfferId = computed(() => selectedOffer.value?.id ?? null)

  const purchaseStatus = ref<PurchaseStatus>('idle')
  const purchaseError = ref('')
  const donePurchase = ref<Purchase | null>(null)

  const restoreStatus = ref<RestoreStatus>('idle')
  const restoreError = ref('')
  const restoredPurchase = ref<Purchase | null>(null)

  // Покупка и восстановление не идут одновременно: иначе две операции пишут в одно состояние
  const isBusy = computed(() => purchaseStatus.value === 'pending' || restoreStatus.value === 'pending')

  function selectOffer(id: string) {
    if (isBusy.value) return
    chosenOfferId.value = id
    // Прошлые ошибки относятся к другому тарифу и к прошлому действию — после смены
    // выбора они только путают
    if (purchaseStatus.value === 'error') purchaseStatus.value = 'idle'
    purchaseError.value = ''
    restoreError.value = ''
  }

  async function buySubscription() {
    const offer = selectedOffer.value
    if (!offer || isBusy.value) return

    purchaseStatus.value = 'pending'
    purchaseError.value = ''
    restoreError.value = ''

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
    if (isBusy.value) return

    restoreStatus.value = 'pending'
    restoreError.value = ''
    restoredPurchase.value = null
    // Неудачная покупка к восстановлению отношения не имеет: иначе на экране разом
    // висели бы ошибка покупки и сообщение о восстановлении
    if (purchaseStatus.value === 'error') purchaseStatus.value = 'idle'
    purchaseError.value = ''

    try {
      const response = await $fetch<RestoreResponse>('/api/restore', { method: 'POST' })
      restoredPurchase.value = response.purchase
      restoreStatus.value = response.restored ? 'found' : 'not-found'
    } catch (requestError) {
      // Запрос не прошёл — это не «покупок нет», поэтому состояние остаётся исходным,
      // а текст ошибки показывается рядом со ссылкой
      restoreStatus.value = 'idle'
      restoreError.value = readApiError(requestError)
    }
  }

  /** Возврат к тарифам с экрана успеха — в приложении здесь закрылось бы окно оплаты */
  function resetPaywall() {
    purchaseStatus.value = 'idle'
    purchaseError.value = ''
    donePurchase.value = null
    restoreStatus.value = 'idle'
    restoreError.value = ''
    restoredPurchase.value = null
  }

  return {
    offers,
    offersStatus,
    offersError,
    selectedOfferId,
    isBusy,
    purchaseStatus,
    purchaseError,
    donePurchase,
    restoreStatus,
    restoreError,
    restoredPurchase,
    retryOffers,
    selectOffer,
    buySubscription,
    restorePurchases,
    resetPaywall,
  }
}
