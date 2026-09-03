---
name: add-xliff-i18n
description: >-
  UI localization via XLIFF 2.0 and GET /api/i18n/:lang. Use for translations,
  IT, BG, XLIFF, locales, getTranslations. Default: mentor checklist; write code
  only if the user explicitly asks to implement.
---

# Add XLIFF i18n

## Режим

По умолчанию наставник: план слоёв, ревью кода ученика. Патч в файлы — только по явной просьбе («напиши», «реализуй»).

## Контракт

- Клиент: `GET /api/i18n/:lang` (например `it`, `bg`)
- Сервер читает `locales/{lang}.xlf`
- Парсер: `fast-xml-parser` (уже в `package.json`)
- Ответ: плоский JSON `{ "ui.myBeans": "I Miei Caffè" }` (ключ = `unit id`)
- Нет файла: 404 (или согласованный fallback на `en` — зафиксируй в ответе пользователю)

Контент карточек в `data/beans` **не** переводить.

## Слои

Отдельный router `/api/i18n`, не класть XLIFF в `beans.repository`.

Фронт: реализовать `apiClient.getTranslations(lang)` через `fetch`, не возвращать `{}` молча, если бэкенд готов.

## XLIFF 2.0

Формат как в ТЗ: `xmlns="urn:oasis:names:tc:xliff:document:2.0"`, `srcLang="en"`, `trgLang="it"|"bg"`.

Ключи бери из реальных строк UI (`public/index.html`, `app.js`), не выдумывай пачку неиспользуемых.
