# Ветка `submit` для преподавателя

`.cursor/` и `AGENTS.md` остаются в `master` (для себя и другого ПК). Преподу отдаёте ветку **`submit`** без этих файлов.

Файл лежит внутри `.cursor/`, поэтому на `submit` его тоже не будет.

## Один раз: создать ветку

На `master`, с уже закоммиченным `.cursor`:

```powershell
git checkout master
git checkout -b submit
git rm -r --cached .cursor
git rm --cached AGENTS.md
```

В `.gitignore` на этой ветке добавьте:

```gitignore
.cursor/
AGENTS.md
```

Потом:

```powershell
git add .gitignore
git commit -m "Hide agent config from submission"
git push -u origin submit
```

Ссылка преподу: репозиторий + ветка `submit`  
(`.../tree/submit` или `git clone -b submit <url>`).

## Другой свой компьютер

Клонируйте **default-ветку** (`master` / `main`), не `submit`:

```powershell
git clone <url>
git checkout master
git pull origin master
```

Так приедут и код, и `.cursor/`.

## Обновить `submit` после работы на `master`

```powershell
git checkout submit
git merge master
# если merge вернул .cursor и AGENTS.md — снова:
git rm -r --cached .cursor
git rm --cached AGENTS.md
git add .gitignore
git commit -m "Keep agent config out of submit"
git push origin submit
git checkout master
```

Не делайте `submit` веткой по умолчанию на GitHub.
