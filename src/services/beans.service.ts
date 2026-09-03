import {type Bean, Recipe} from '../types/beans'
import * as repo from '../repositories/beans.repository'
import {randomUUID} from "node:crypto";
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

// ====== UPDATE PUT / CREATE POST======

type NewBean = Omit<Bean, 'id' | 'recipes'> & { recipes?: Recipe[] }

function normalize(data: unknown): NewBean {   // не экспортируется = private
    const d = data as Partial<NewBean>
    if (!d?.title?.trim() || !d?.country?.trim()) throw new Error('BAD_REQUEST')

    return {
        title: d.title.trim(),
        country: d.country.trim(),
        description: d.description?.trim() ?? '',
        roasterComment: d.roasterComment?.trim() ?? '',
        imageUrl: d.imageUrl?.trim() ?? '',
        details: {
            process: d.details?.process?.trim() ?? 'Unknown',
            region: d.details?.region?.trim() ?? 'Unknown',
            variety: d.details?.variety ?? [],
            scaScore: d.details?.scaScore ?? 0
        },
        flavorProfile: {
            notes: d.flavorProfile?.notes ?? [],
            acidity: d.flavorProfile?.acidity ?? 0,
            sweetness: d.flavorProfile?.sweetness ?? 0,
            bitterness: d.flavorProfile?.bitterness ?? 0
        }
    }
}

// ====== UPDATE PUT======
export async function update(id: string, body: NewBean) {
    const bodyNormalize = normalize(body)
    const existing = await repo.findById(id)

    if (!existing) throw new Error('NOT_FOUND')
    const update_bean = {
        ...existing,
        ...bodyNormalize,
        id: existing.id,
        recipes: existing.recipes
    }
    const saved_bean = await repo.update(id, update_bean)
    if(!saved_bean) throw new Error('NOT_FOUND')
    return saved_bean
}

// ====== CREATE POST ======
export async function create(beanCreate: NewBean): Promise<Bean> {
    let newBean: Bean
    const id = randomUUID();
    const bodyNormalize = normalize(beanCreate)

    if (beanCreate.recipes && beanCreate.recipes.length > 0) {
        newBean = {
            id: id,
            ...bodyNormalize,
            recipes: beanCreate.recipes
        };
    } else {
        newBean = {
            id: id,
            ...bodyNormalize,
            recipes: defaultRecipes()
        }
    }
    return await repo.create(newBean);
}