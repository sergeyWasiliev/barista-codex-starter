import { promises as fs } from 'fs'
import path from 'path'
import { Bean } from '../types/beans'
import { DATA_DIR } from '../config/paths'

async function readBean(fullPath: string): Promise<Bean> {
    return JSON.parse(await fs.readFile(fullPath, 'utf-8')) as Bean
}

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
