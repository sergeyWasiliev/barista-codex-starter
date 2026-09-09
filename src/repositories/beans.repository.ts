import {Bean, Recipe} from '../types/beans'
import {getDb} from '../db'

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

// Превращает доменный объект Bean в строку таблицы beans
function beanToRow(bean: Bean): BeanRow {
    return {
        id: bean.id,
        title: bean.title,
        country: bean.country,
        description: bean.description,
        roaster_comment: bean.roasterComment,
        image_url: bean.imageUrl,
        process: bean.details.process,
        region: bean.details.region,
        variety_json: JSON.stringify(bean.details.variety),
        sca_score: bean.details.scaScore,
        notes_json: JSON.stringify(bean.flavorProfile.notes),
        acidity: bean.flavorProfile.acidity,
        sweetness: bean.flavorProfile.sweetness,
        bitterness: bean.flavorProfile.bitterness,
    }
}

// Превращает доменный объект Recipe в строку таблицы recipes
function recipeToRow(recipe: Recipe, beanId: string): RecipeRow {
    return {
        id: recipe.id,
        bean_id: beanId,
        method: recipe.method,
        grind_size: recipe.grindSize,
        water_temp: recipe.waterTemp,
        dose_in: recipe.doseIn,
        dose_out: recipe.doseOut,
        time_total: recipe.timeTotal,
        steps_json: JSON.stringify(recipe.steps),
    }
}

// ====== GET ======
export async function findAll(): Promise<Bean[]> {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM beans').all() as BeanRow[]

    return rows.map((row) => {
        const recipeRows = db
            .prepare('SELECT * FROM recipes WHERE bean_id = ?')
            .all(row.id) as RecipeRow[]

        return rowToBean(row, recipeRows.map(rowToRecipe))
    })
}

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
export async function remove(id: string): Promise<boolean> {
    const db = getDb()
    const result = db.prepare('DELETE FROM beans WHERE id = ?').run(id)
    return result.changes > 0
}

// ====== UPDATE ======
export async function update(id: string, bean: Bean): Promise<Bean | null> {
    const db = getDb()

    const existing = db.prepare('SELECT id FROM beans WHERE id = ?').get(id)
    if (!existing) return null
    const updateBean = db.prepare(`
        UPDATE beans
        SET title           = @title,
            country         = @country,
            description     = @description,
            roaster_comment = @roaster_comment,
            image_url       = @image_url,
            process         = @process,
            region          = @region,
            variety_json    = @variety_json,
            sca_score       = @sca_score,
            notes_json      = @notes_json,
            acidity         = @acidity,
            sweetness       = @sweetness,
            bitterness      = @bitterness
        WHERE id = @id
    `)

    const deleteRecipes = db.prepare('DELETE FROM recipes WHERE bean_id = ?')

    const insertRecipe = db.prepare(`
        INSERT INTO recipes (id, bean_id, method, grind_size, water_temp,
                             dose_in, dose_out, time_total, steps_json)
        VALUES (@id, @bean_id, @method, @grind_size, @water_temp,
                @dose_in, @dose_out, @time_total, @steps_json)
    `)

    const saveAll = db.transaction((b: Bean) => {
        updateBean.run(beanToRow(b))
        deleteRecipes.run(b.id)
        for (const recipe of b.recipes) {
            insertRecipe.run(recipeToRow(recipe, b.id))
        }
    })

    saveAll(bean)
    return bean

}

export async function create(bean: Bean) {
    const db = getDb()

    const insertBean = db.prepare(`
        INSERT INTO beans (id, title, country, description, roaster_comment, image_url,
                           process, region, variety_json, sca_score, notes_json,
                           acidity, sweetness, bitterness)
        VALUES (@id, @title, @country, @description, @roaster_comment, @image_url,
                @process, @region, @variety_json, @sca_score, @notes_json,
                @acidity, @sweetness, @bitterness)
    `)

    const insertRecipe = db.prepare(`
        INSERT INTO recipes (id, bean_id, method, grind_size, water_temp,
                             dose_in, dose_out, time_total, steps_json)
        VALUES (@id, @bean_id, @method, @grind_size, @water_temp,
                @dose_in, @dose_out, @time_total, @steps_json)
    `)
    const insertAll = db.transaction((b: Bean) => {
        insertBean.run(beanToRow(b))

        for (const recipe of b.recipes) {
            insertRecipe.run(recipeToRow(recipe, b.id))
        }
    })

    insertAll(bean)
    return bean
}

