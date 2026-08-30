import { type Bean } from '../types/beans'
import * as repo from '../repositories/beans.repository'

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