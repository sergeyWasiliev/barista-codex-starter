import {Request, Response} from "express";
import * as service from '../services/i18n.service'

//====== LOCALIZATION ======
export async function getTranslations(req: Request<{lang:string}>, res: Response) {
    try {
        const translate = await service.getTranslations(req.params.lang)
        res.status(200).json(translate)
    }catch (e) {
        if (e instanceof Error && e.message === 'NOT_FOUND') {
            res.status(404).json({message: 'Translations not found'})
            return
        }
        throw e
    }
}