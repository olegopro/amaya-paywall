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

/**
 * Состояние экрана оплаты и запросы к server routes.
 * Страница передаёт это состояние в PaywallScreen, а тот только рисует —
 * поэтому экран целиком показывается в Storybook без Nuxt и без сети.
 *
 * Файл живёт только в приложении, поэтому здесь работают автоимпорты Nuxt
 * (useFetch, computed, ref, readApiError); в компонентах импорты остаются явными
 * ради витрины. Ожидание ответа не задерживает setup: пока тарифы едут, экран
 * показывает заглушки, а страница остаётся синхронной.
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

  /** Тексты прошлых ошибок после нового действия только путают */
  function clearErrors() {
    purchaseError.value = ''
    restoreError.value = ''
  }

  function selectOffer(id: string) {
    if (isBusy.value) return
    chosenOfferId.value = id
    clearErrors()
  }

  async function buySubscription() {
    const offer = selectedOffer.value
    if (!offer || isBusy.value) return

    purchaseStatus.value = 'pending'
    clearErrors()

    try {
      const response = await $fetch<PurchaseResponse>('/api/purchase', {
        method: 'POST',
        body: { offerId: offer.id },
      })
      donePurchase.value = response.purchase
      purchaseStatus.value = 'success'
    } catch (requestError) {
      // Сбой покупки — не отдельное состояние экрана, а текст рядом с кнопкой
      purchaseStatus.value = 'idle'
      purchaseError.value = readApiError(requestError)
    }
  }

  async function restorePurchases() {
    if (isBusy.value) return

    restoreStatus.value = 'pending'
    restoredPurchase.value = null
    clearErrors()

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
    donePurchase.value = null
    restoreStatus.value = 'idle'
    restoredPurchase.value = null
    clearErrors()
  }

  return {
    offers,
    offersStatus,
    offersError,
    selectedOfferId,
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
