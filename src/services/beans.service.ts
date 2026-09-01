import {type Bean, Recipe} from '../types/beans'
import * as repo from '../repositories/beans.repository'
import {v4 as uuidv4} from "uuid"
import {defaultRecipes} from "./constans";
import {findById} from "../repositories/beans.repository";
import {beansRouter} from "../routes/beans.routes";
import {read} from "node:fs";

export const getAll = () => repo.findAll()

export async function getById(id: string): Promise<Bean> {
    const bean = await repo.findById(id)
    if (!bean) throw new Error('NOT_FOUND')
    return bean
}

// ===== DELETE =====

export async function remove(id: string): Promise<void> {
    const deleted = await repo.remove(id)
    if (!deleted) throw new Error('NOT_FOUND')
}

// ====== UPDATE ======
export async function update(id: string, body: Omit<Bean, 'id' | 'recipes'>) {
    const existing = await repo.findById(id)
    if (!existing) throw new Error('NOT_FOUND')
    const merged = {
        ...existing,
        ...body,
        id: existing.id,
        recipes: existing.recipes
    }
    const saved = await repo.update(id, merged)
    if(!saved) throw new Error('NOT_FOUND')
    return saved
}

// ====== CREATE ======
export async function create(beanCreate: Omit<Bean, 'id' | 'recipes'> & { recipes?: Recipe[] }): Promise<Bean> {
    if (!beanCreate.title?.trim() || !beanCreate.country?.trim()) {
        throw new Error('BAD_REQUEST');
    }

    let bean: Bean
    const id = uuidv4();
    if (beanCreate.recipes && beanCreate.recipes.length > 0) {
        bean = {
            id: id,
            ...beanCreate,
            recipes: beanCreate.recipes
        };
    } else {
        bean = {
            id: id,
            ...beanCreate,
            recipes: defaultRecipes()
        }
    }
    return await repo.create(bean);
}