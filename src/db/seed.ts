import {readdirSync, readFileSync} from 'fs'
import path from 'path'
import {DATA_DIR} from '../config/paths'
import {getDb} from './index'
import {create} from '../repositories/beans.repository'
import {Bean} from '../types/beans'
import {randomUUID} from "node:crypto";

export function seedFromJson(): void {
    const db = getDb()
    const row = db.prepare('SELECT COUNT(*) AS count FROM beans').get() as { count: number }

    if (row.count > 0) {
        return // уже есть данные (свои Add или прошлый seed) — не дублируем
    }

    const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))


// Переназначаем id бинам и рецептам перед записью в БД, т.к. есть повторы
    for (const file of files) {
        const fullPath = path.join(DATA_DIR, file)
        const bean = JSON.parse(readFileSync(fullPath, 'utf-8')) as Bean

        bean.id = randomUUID()
        bean.recipes = (bean.recipes ?? []).map((recipe) => ({
            ...recipe,
            id: randomUUID(),
        }))

        void create(bean)
    }

    console.log(`Seed: loaded ${files.length} beans from JSON`)
}
