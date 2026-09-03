import { Router } from 'express'
import * as controller from '../controllers/i18n.controller'

export const i18nRouter = Router()
i18nRouter.get('/:lang', controller.getTranslations)