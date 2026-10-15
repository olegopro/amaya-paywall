<script setup lang="ts">
/*
  Заглушка карточки на время загрузки тарифов: повторяет её габариты,
  поэтому экран не «прыгает», когда приходят данные.
*/
</script>

<template>
  <div class="offer-skeleton" aria-hidden="true">
    <span class="offer-skeleton__radio" />
    <span class="offer-skeleton__info">
      <span class="offer-skeleton__bar offer-skeleton__bar--title" />
      <span class="offer-skeleton__bar offer-skeleton__bar--hint" />
    </span>
    <span class="offer-skeleton__bar offer-skeleton__bar--price" />
  </div>
</template>

<style scoped>
.offer-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 18px;
}

.offer-skeleton__radio {
  width: 24px;
  height: 24px;
  flex: none;
  background: var(--border);
  border-radius: 50%;
}

.offer-skeleton__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.offer-skeleton__bar {
  height: 12px;
  background: var(--border);
  border-radius: var(--radius-pill);
}

.offer-skeleton__bar--title {
  width: 56px;
}

.offer-skeleton__bar--hint {
  width: 96px;
  height: 10px;
  background: #f0ecfb;
}

.offer-skeleton__bar--price {
  width: 64px;
  height: 16px;
}

/* Мягкое мерцание: видно, что экран ждёт данные, а не завис */
.offer-skeleton__bar,
.offer-skeleton__radio {
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
