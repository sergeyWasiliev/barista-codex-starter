import {promises as fs} from 'fs'
import path from 'path'
import {Bean, Recipe} from '../types/beans'
import {DATA_DIR} from '../config/paths'
import { getDb } from '../db'

type BeanRow = {
    id: string
    title: string
    country: string
    description: string
    roaster_comment: string
    image_url: string
    process: string
    region: string
    variety_json: string
    sca_score: number
    notes_json: string
    acidity: number
    sweetness: number
    bitterness: number
}

type RecipeRow = {
    id: string
    bean_id: string
    method: string
    grind_size: string
    water_temp: number
    dose_in: number
    dose_out: number
    time_total: string
    steps_json: string
}

function rowToRecipe(row: RecipeRow): Recipe {
    return {
        id: row.id,
        method: row.method,
        grindSize: row.grind_size,
        waterTemp: row.water_temp,
        doseIn: row.dose_in,
        doseOut: row.dose_out,
        timeTotal: row.time_total,
        steps: JSON.parse(row.steps_json) as string[],
    }
}

function rowToBean(row: BeanRow, recipes: Recipe[]): Bean {
    return {
        id: row.id,
        title: row.title,
        country: row.country,
        description: row.description,
        roasterComment: row.roaster_comment,
        imageUrl: row.image_url,
        details: {
            process: row.process,
            region: row.region,
            variety: JSON.parse(row.variety_json) as string[],
            scaScore: row.sca_score,
        },
        flavorProfile: {
            notes: JSON.parse(row.notes_json) as string[],
            acidity: row.acidity,
            sweetness: row.sweetness,
            bitterness: row.bitterness,
        },
        recipes,
    }
}




async function readBean(fullPath: string): Promise<Bean> {
    return JSON.parse(await fs.readFile(fullPath, 'utf-8')) as Bean
}

// ====== GET ======
export async function findAll(): Promise<Bean[]> {
    const files = await fs.readdir(DATA_DIR)
    return Promise.all(
        files
            .filter((f) => f.endsWith('.json'))
            .map((f) => readBean(path.join(DATA_DIR, f)))
    )
}

// export async function findById(id: string): Promise<Bean | null> {
//     return (await findAll()).find((b) => b.id === id) ?? null
// }

export async function findById(id: string): Promise<Bean | null> {
    const db = getDb()
    const row = db.prepare('SELECT * FROM beans WHERE id = ?').get(id) as BeanRow | undefined
    if (!row) return null

    const recipeRows = db
        .prepare('SELECT * FROM recipes WHERE bean_id = ?')
        .all(id) as RecipeRow[]

    return rowToBean(row, recipeRows.map(rowToRecipe))
}

// ====== DELETE ======

async function findFileById(id: string): Promise<string | null> {   // не экспортируется = private
    const files = await fs.readdir(DATA_DIR)
    for (const f of files) {
        if (!f.endsWith('.json')) continue
        const fullPath = path.join(DATA_DIR, f)
        const bean = await readBean(fullPath)
        if (bean.id === id) return fullPath
    }
    return null
}

export async function remove(id: string): Promise<boolean> {
    const fullPath = await findFileById(id)
    if (!fullPath) return false
    await fs.unlink(fullPath)
    return true
}

// ====== UPDATE ======
export async function update(id: string, bean: Bean): Promise<Bean | null> {
    const fullPath = await findFileById(id)
    if (!fullPath) return null
    await fs.writeFile(fullPath, JSON.stringify(bean, null, 2), "utf-8")
    return bean

}

// ====== CREATE ======
export async function create(bean: Bean) {
    const fullPath = path.join(DATA_DIR, `${bean.id}.json`)
    const beanText = JSON.stringify(bean, null, 2)
    await fs.writeFile(fullPath, beanText, "utf-8")
    return bean;
}

