# Общая стена предложений

Общая стена подключена к Cloudflare Workers + D1.

API: https://ali-erkinov-exhibition-notes.ali-erkinov-portfolio.workers.dev/api/notes

База: ali-erkinov-exhibition-notes, привязка DB.

## Подключение после входа

1. `npx wrangler login`
2. `npx wrangler whoami`
3. `npx wrangler d1 create ali-erkinov-exhibition-notes`
4. В `wrangler.jsonc` заменить `REPLACE_AFTER_DATABASE_CREATION` на возвращённый `database_id`.
5. `npx wrangler d1 migrations apply ali-erkinov-exhibition-notes --remote`
6. `npx wrangler secret put IP_SALT` и ввести случайный секрет. Секрет хранить только в Cloudflare, не в репозитории и не в браузере.
7. `npx wrangler deploy`
8. В корневом `guestbook-config.json` задать `apiUrl`: фактический адрес опубликованного Worker с путём `/api/notes`.
9. Проверить публикацию с двух разных браузеров, затем отправить клиентские изменения в GitHub Pages.

## Поведение

- Посетители пишут без аккаунта; стикеры видят все.
- Текст 3–240 символов, имя необязательно, до 32 символов, четыре цвета.
- Клиент выводит только текст, без HTML-разметки.
- Сервер проверяет поля, источник запроса, ловушку ботов и ограничивает частоту: не чаще раза в минуту и пяти раз в час с одного IP.
- IP не сохраняется: используется хеш с секретной солью и суточной ротацией.
- API возвращает последние 200 стикеров, интерфейс показывает по восемь на стене.
- Удаление и модерация доступны владельцу через консоль D1; публичного удаления нет.
- При сбое отправки текст остаётся в форме.

## Проверка

`node test.mjs` (Node.js 22+ с `node:sqlite`). Проверены сохранение/чтение без сессии посетителя, валидация, ограничение частоты, CORS и отсутствие IP-хеша в ответах.
