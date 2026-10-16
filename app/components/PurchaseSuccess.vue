<script setup lang="ts">
import { computed } from 'vue'
import type { Purchase } from '#shared/types/paywall'
import { formatDate } from '~/utils/format'

/*
  Экран успеха: показывается вместо paywall, чтобы после покупки
  не осталось кнопки «Оформить» и повторной оплаты.
*/
const props = defineProps<{
  /** Название тарифа: у покупки из БД есть только id, название ищет экран оплаты */
  offerTitle: string
  purchase: Purchase
}>()

const emit = defineEmits<{ reset: [] }>()

const purchaseLabel = computed(() => `Покупка №${props.purchase.id} · ${formatDate(props.purchase.createdAt)}`)
</script>

<template>
  <div class="success">
    <div class="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="m5.5 12.5 4.5 4.5 8.5-9" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <h1 class="title screen-title">Подписка оформлена</h1>
    <p class="text">
      Тариф «{{ offerTitle }}» активирован на этом устройстве. Полный контент открыт.
    </p>

    <p class="purchase">{{ purchaseLabel }}</p>

    <button type="button" class="cta btn-primary" @click="emit('reset')">Играть</button>

    <p class="note">В приложении окно оплаты в этот момент закрывается само.</p>
  </div>
</template>

<style scoped lang="scss">
  .success {
    display: flex;
    // Как и у paywall: экран заполняет окно приложения, высоту задаёт оно
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom));
    text-align: center;

    .icon {
      display: flex;
      width: 92px;
      height: 92px;
      align-items: center;
      justify-content: center;
      background: linear-gradient(160deg, var(--success) 0%, var(--success-strong) 100%);
      border-radius: 50%;
      box-shadow: 0 12px 26px rgba(13, 122, 83, 0.28);

      svg {
        width: 48px;
        height: 48px;
      }
    }

    .title {
      margin: 8px 0 0;
    }

    .text {
      max-width: 300px;
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .purchase {
      margin: 4px 0 0;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      color: var(--brand-strong);
      background: var(--brand-soft);
      border-radius: 12px;
    }

    .cta {
      margin-top: 12px;
    }

    .note {
      max-width: 280px;
      margin: 2px 0 0;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.4;
      color: var(--text-muted);
    }
  }
</style>
