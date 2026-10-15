<script setup lang="ts">
import PaywallScreen from '~/components/PaywallScreen.vue'
import { usePaywall } from '~/composables/usePaywall'

// Страница отвечает за данные: composable ходит в server routes,
// а PaywallScreen только рисует переданное состояние.
const {
  offers,
  offersStatus,
  offersError,
  selectedOfferId,
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
} = await usePaywall()
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
    :restored-purchase="restoredPurchase"
    @select="selectOffer"
    @purchase="buySubscription"
    @retry="retryOffers()"
    @restore="restorePurchases"
    @reset="resetPaywall"
  />
</template>
