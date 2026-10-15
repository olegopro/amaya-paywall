<template>
  <!--
    Экран мобильный: в webview колонка занимает всю ширину, в широком окне
    (проверка на компьютере) остаётся по центру и не растягивается.
  -->
  <div class="app-shell">
    <NuxtPage />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: var(--bg);
}

@media (min-width: 480px) {
  .app-shell {
    box-shadow: 0 0 0 1px var(--border), 0 24px 60px rgba(36, 27, 77, 0.06);
  }
}
</style>
