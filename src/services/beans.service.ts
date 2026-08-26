import { type Bean } from '../types/beans'
import * as repo from '../repositories/beans.repository'

export const getAll = () => repo.findAll()

export async function getById(id: string): Promise<Bean> {
    const bean = await repo.findById(id)
    if (!bean) throw new Error('NOT_FOUND')
    return bean
}