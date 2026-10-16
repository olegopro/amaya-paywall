<script setup lang="ts">
// Страница отвечает за данные: composable ходит в server routes,
// а PaywallScreen только рисует переданное состояние.
// Страницу собирает Nuxt, поэтому PaywallScreen и usePaywall приходят автоимпортом.
const {
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
} = usePaywall()
</script>

<template>
  <PaywallScreen
    :offers="offers"
    :offers-status="offersStatus"
    :offers-error="offersError"
    :selected-offer-id="selectedOfferId"
    :purchase-status="purchaseStatus"
    :purchase-error="purchaseError"
    :done-purchase="donePurchase"
    :restore-status="restoreStatus"
    :restore-error="restoreError"
    :restored-purchase="restoredPurchase"
    @select="selectOffer"
    @purchase="buySubscription"
    @retry="retryOffers()"
    @restore="restorePurchases"
    @reset="resetPaywall"
  />
</template>
