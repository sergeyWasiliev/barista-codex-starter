---
name: implement-crud-layer
description: >-
  Beans CRUD through routes, controller, service, repository, and public/js/api.js.
  Use for POST, PUT, CREATE, UPDATE, createBean/updateBean. Default: mentor checklist
  and review; write code only if the user explicitly asks to implement.
---

# Implement CRUD layer

## Режим

В этом репозитории по умолчанию **наставник**:

1. Сверь схему ученика с ТЗ (п. 4.1).
2. Дай порядок слоёв и на что смотреть в каждом.
3. Ревью присланного кода (ошибки типов, merge `recipes`, слои).
4. **Пиши/правь файлы только** если пользователь явно сказал «напиши», «реализуй», «внеси правки».

## Порядок работы (чеклист или реализация)

1. Прочитай `readme/2. Technical Specification.md` (п. 4.1) и текущие файлы слоёв — копируй стиль DELETE/GET.
2. Repository: чтение/запись JSON. Поиск карточки по `bean.id` внутри файла, не только по имени файла.
3. Service: валидация и `NOT_FOUND`. UUID через `uuid` (зависимость уже есть). PUT: сохранить `id` и `recipes` с диска.
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

## После (если код уже есть или только что написали)

Кратко скажи, как проверить: `curl` или UI. Для UI — клик по форме.
