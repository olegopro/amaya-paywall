# Amaya Paywall - тестовое задание

Мобильный экран оплаты для условной детской игры: два тарифа, тестовая покупка,
восстановление покупок. Frontend и server routes в одном приложении Nuxt 4 (TypeScript, strict).

- Живой сервис: https://amaya-paywall-sepia.vercel.app
- Витрина экрана: https://amaya-paywall-sepia.vercel.app/storybook/
- Репозиторий: https://github.com/olegopro/amaya-paywall

## Запуск локально

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # витрина Storybook, затем сборка Nuxt
npm run storybook    # витрина на http://localhost:6006
```

Без `DATABASE_URL` покупки пишутся в память процесса (строка предупреждения в логе; при
перезапуске данные исчезают) - аккаунты и ключи не нужны. Для Postgres скопируйте
`.env.example` в `.env`.

## Где что находится

| Часть | Файл |
| --- | --- |
| Экран | `app/pages/index.vue`, `app/components/PaywallScreen.vue` |
| Состояние и запросы | `app/composables/usePaywall.ts` |
| `GET /api/offers` | `server/api/offers.get.ts`: тарифы с ценами заданы на сервере |
| `POST /api/purchase` | `server/api/purchase.post.ts`: проверяет `offerId` по списку тарифов, 400 на чужой |
| `POST /api/restore` | `server/api/restore.post.ts`: последняя покупка устройства |
| База | `server/utils/db.ts`, таблица `purchases` создаётся сама |
| Тарифы и устройство | `shared/offers.ts` (один список для server routes и витрины), `server/utils/device.ts` (httpOnly-кука `device_id`) |
| Витрина | `.storybook/`, `app/**/*.stories.ts` |

Экран собран из презентационных компонентов (`props`/`emit`), поэтому в Storybook открывается
любое состояние без Nuxt и без сети.

## Почему Vercel и Neon

Server routes на Vercel работают без настройки, деплой из панели. База создана там же
(Storage → Neon, бесплатный план, iad1), `DATABASE_URL` интеграция подключила сама.
Драйвер `@neondatabase/serverless` ходит в Postgres по HTTP: в serverless TCP-соединение
не переживает запрос.

## Почему вместо Figma Storybook

Макет не рисовался: витрина показывает те же продакшн-компоненты и CSS, поэтому не разойдётся
с кодом. Истории: экран в состояниях (рабочий, загрузка, ошибка тарифов, ошибка покупки, успех)
и карточка тарифа (обычная, выбранная).

## ИИ-инструменты

- **Claude Code** (агент, модель DeepSeek V4.1 Flash): каркас Nuxt, server routes, компоненты, истории, README.
- **Claude Opus** в отдельной сессии: постановка задачи и ревью кода, снимков, README.
- API Nuxt 4 и Storybook 10 сверялись через Context7, снимки снимались в headless Firefox.

## Что проверено руками

Открыл живой сервис и витрину в браузере: вид на телефонной ширине и окном на компьютере, все состояния в Storybook. Диф каждого коммита просмотрен перед push. Запись покупки проверена в таблице Neon.

## Что сделал бы ещё за 2 часа

- покупку через SDK магазина и проверку чека на сервере;
- вход в аккаунт вместо устройства;
- тесты: unit и e2e на сценарий оплаты;
- аналитику воронки и повторную отправку покупки без дубля.
