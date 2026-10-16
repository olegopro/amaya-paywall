<template>
  <!--
    Заглушка карточки на время загрузки тарифов: повторяет её габариты,
    поэтому экран не «прыгает», когда приходят данные.
  -->
  <div class="offer-skeleton" aria-hidden="true">
    <span class="radio" />
    <span class="info">
      <span class="bar title-bar" />
      <span class="bar hint-bar" />
    </span>
    <span class="bar price-bar" />
  </div>
</template>

<style scoped lang="scss">
  .offer-skeleton {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius-card-sm);

    .radio {
      width: 24px;
      height: 24px;
      flex: none;
      background: var(--border);
      border-radius: 50%;
    }

    .info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 6px;
    }

    .bar {
      height: 12px;
      background: var(--border);
      border-radius: var(--radius-pill);
    }

    .title-bar {
      width: 56px;
    }

    .hint-bar {
      width: 96px;
      height: 10px;
      background: var(--skeleton-soft);
    }

    .price-bar {
      width: 64px;
      height: 16px;
    }

    // Мягкое мерцание: видно, что экран ждёт данные, а не завис
    .radio,
    .bar {
      animation: skeleton-pulse 1.4s ease-in-out infinite;
    }
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
