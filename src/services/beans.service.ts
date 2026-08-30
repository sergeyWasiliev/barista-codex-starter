import {type Bean, Recipe} from '../types/beans'
import * as repo from '../repositories/beans.repository'
import {v4 as uuidv4} from "uuid"
import {defaultRecipes} from "./constans";

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

// ====== CREATE ======
export async function create(beanCreate: Omit<Bean, 'id' | 'recipes'> & { recipes?: Recipe[] }): Promise<Bean> {
    if (!beanCreate.title?.trim() || !beanCreate.country?.trim()){
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