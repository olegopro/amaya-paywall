<script setup lang="ts">
import { computed } from 'vue'
import type { Offer } from '#shared/types/paywall'
import { formatPeriod, formatPrice } from '~/utils/format'

/*
  Презентационная карточка тарифа: ничего не знает про API и стор —
  состояние и нажатие приходят сверху, поэтому карточка живёт в Storybook.
*/
const props = defineProps<{
  offer: Offer
  selected: boolean
  /** Пока идёт запрос, карточки недоступны — иначе тариф можно сменить под отправленной покупкой */
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()

const priceLabel = computed(() => formatPrice(props.offer.price))

const periodLabel = computed(() => formatPeriod(props.offer.period))

/** Для годового тарифа цена в пересчёте на месяц — так выгода видна без калькулятора */
const hintLabel = computed(() => {
  if (props.offer.months <= 1) return 'Отмена в любой момент'
  return `≈ ${formatPrice(Math.round(props.offer.price / props.offer.months))} в месяц`
})

const badgeLabel = computed(() => (props.offer.savingsPercent ? `Выгодно −${props.offer.savingsPercent}%` : ''))
</script>

<template>
  <button
    type="button"
    class="offer-card"
    :class="{ 'is-selected': selected }"
    :disabled="disabled"
    role="radio"
    :aria-checked="selected"
    @click="emit('select')"
  >
    <span class="radio" aria-hidden="true">
      <svg v-if="selected" class="check" viewBox="0 0 24 24" fill="none">
        <path d="m5.5 12.5 4.5 4.5 8.5-9" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <span class="info">
      <span class="head">
        <span class="title">{{ offer.title }}</span>
        <span v-if="badgeLabel" class="badge">{{ badgeLabel }}</span>
      </span>
      <span class="hint">{{ hintLabel }}</span>
    </span>

    <span class="price">
      <span class="amount">{{ priceLabel }}</span>
      <span class="period">{{ periodLabel }}</span>
    </span>
  </button>
</template>

<style scoped lang="scss">
  .offer-card {
    display: flex;
    width: 100%;
    min-height: var(--tap);
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    text-align: left;
    background: var(--surface);
    // Рамка есть всегда, меняется только цвет: карточка не «прыгает» при выборе
    border: 2px solid var(--border);
    border-radius: var(--radius-card-sm);
    box-shadow: var(--shadow-card);
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;

    &.is-selected {
      background: var(--brand-soft);
      border-color: var(--brand);
      box-shadow: 0 8px 20px rgba(107, 75, 242, 0.16);

      .radio {
        background: var(--brand);
        border-color: var(--brand);
      }
    }

    &:disabled {
      opacity: 0.6;
    }

    // Радиокнопка: форма и галочка, а не только цвет — выбор виден и без цветового зрения
    .radio {
      display: flex;
      width: 24px;
      height: 24px;
      flex: none;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      border: 2px solid var(--border-strong);
      border-radius: 50%;
    }

    .check {
      width: 16px;
      height: 16px;
    }

    .info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title {
      font-size: 17px;
      font-weight: 800;
    }

    .badge {
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
      color: var(--accent);
      background: var(--accent-soft);
      border-radius: var(--radius-pill);
    }

    .hint {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .price {
      display: flex;
      flex: none;
      flex-direction: column;
      align-items: flex-end;
    }

    .amount {
      font-size: 19px;
      font-weight: 800;
      white-space: nowrap;
    }

    .period {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }
  }
</style>
