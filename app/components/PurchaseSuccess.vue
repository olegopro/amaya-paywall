<script setup lang="ts">
import { computed } from 'vue'
import type { Offer, Purchase } from '#shared/types/paywall'
import { formatDate } from '~/utils/format'

/*
  Экран успеха: показывается вместо paywall, чтобы после покупки
  не осталось кнопки «Оформить» и повторной оплаты.
*/
const props = defineProps<{
  offer: Offer | null
  purchase: Purchase
}>()

const emit = defineEmits<{ reset: [] }>()

const offerTitle = computed(() => props.offer?.title ?? props.purchase.offerId)
const purchaseLabel = computed(() => `Покупка №${props.purchase.id} · ${formatDate(props.purchase.createdAt)}`)
</script>

<template>
  <div class="success">
    <div class="success__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m5.5 12.5 4.5 4.5 8.5-9" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <h1 class="success__title">Подписка оформлена</h1>
    <p class="success__text">
      Тариф «{{ offerTitle }}» активирован на этом устройстве. Полный контент открыт.
    </p>

    <p class="success__purchase">{{ purchaseLabel }}</p>

    <button type="button" class="success__cta" @click="emit('reset')">Играть</button>

    <p class="success__note">В приложении окно оплаты в этот момент закрывается само.</p>
  </div>
</template>

<style scoped>
.success {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom));
  text-align: center;
}

.success__icon {
  display: flex;
  width: 92px;
  height: 92px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, var(--success) 0%, #0a6746 100%);
  border-radius: 50%;
  box-shadow: 0 12px 26px rgba(13, 122, 83, 0.28);
}

.success__icon svg {
  width: 48px;
  height: 48px;
}

.success__title {
  margin: 8px 0 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.success__text {
  max-width: 300px;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
}

.success__purchase {
  margin: 4px 0 0;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-strong);
  background: var(--brand-soft);
  border-radius: 12px;
}

.success__cta {
  width: 100%;
  min-height: 56px;
  margin-top: 12px;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(180deg, var(--brand) 0%, var(--brand-strong) 100%);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-cta);
  transition: transform 0.12s ease;
}

.success__cta:active {
  transform: scale(0.985);
}

.success__note {
  max-width: 280px;
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-muted);
}
</style>
