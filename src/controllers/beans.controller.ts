import { Request, Response } from 'express'
import * as service from '../services/beans.service'

export async function getAllBeans(req: Request, res: Response) {
    const beans = await service.getAll()
    res.json(beans)
}

export async function getBeanById(req: Request<{ id: string }>, res: Response) {
    try {
        res.json(await service.getById(req.params.id))
    } catch {
        res.status(404).json({ message: 'Bean not found' })
    }
}