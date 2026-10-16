<template>
  <!--
    Экран мобильный. В webview и на узком окне колонка занимает всю ширину и высоту,
    а в широком окне (проверка на компьютере) показывается «окошком»: отступы сверху и снизу,
    рамка и скругление — так видно, где заканчивается экран приложения.
  -->
  <div class="app-shell">
    <NuxtPage />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  background: var(--bg);
}

@media (min-width: 480px) {
  .app-shell {
    /* Отступы по 32 px: высота окна минус они, содержимое шире — окно растёт вместе с ним */
    min-height: calc(100dvh - 64px);
    margin: 32px auto;
    border: 1px solid var(--border);
    border-radius: 28px;
    box-shadow: 0 24px 60px rgba(36, 27, 77, 0.12);
    /* Скруглённые углы не должны обрезаться содержимым экрана */
    overflow: hidden;
  }
}
</style>
