import {promises as fs} from 'fs'
import path from 'path'
import {Bean} from '../types/beans'
import {DATA_DIR} from '../config/paths'

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

export async function findById(id: string): Promise<Bean | null> {
    return (await findAll()).find((b) => b.id === id) ?? null
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

