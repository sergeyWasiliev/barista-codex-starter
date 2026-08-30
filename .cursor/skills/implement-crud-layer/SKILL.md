---
name: implement-crud-layer
description: Implements a beans CRUD operation through routes, controller, service, repository, and public/js/api.js. Use when adding POST, PUT, CREATE, UPDATE, or wiring apiClient createBean/updateBean.
---

# Implement CRUD layer

## Порядок работы

1. Прочитай `readme/2. Technical Specification.md` (п. 4.1) и текущие файлы слоёв — копируй стиль DELETE/GET.
2. Repository: чтение/запись JSON. Поиск карточки по `bean.id` внутри файла, не только по имени файла.
3. Service: валидация и `NOT_FOUND`. UUID через `uuid` (зависимость уже есть).
4. Controller: HTTP-коды (201/200/204/400/404). Без `fs`.
5. Route: одна строка `beansRouter.post` / `.put`.
6. `public/js/api.js`: `fetch` + проверка `res.ok`. Для CREATE/UPDATE парсить JSON, если сервер его отдаёт.
7. Не включай Beta (SQL, multer, `type`) в этот же PR/дифф.

## POST

- Нет `title` или `country` → 400
- Сгенерировать `id` (UUID v4)
- Нет `recipes` → House Standard из ТЗ (V60 + Espresso, свои uuid у рецептов)

## PUT

- Прочитать текущую сущность
- Сохранить старый `recipes`, если клиент его не прислал
- Смержить остальные поля и записать файл
- Нет файла → 404

## После кода

Кратко скажи, как проверить: `curl` или UI. Для UI — клик по форме, не только скриншот.
