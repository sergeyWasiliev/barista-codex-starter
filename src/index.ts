import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { beansRouter } from './routes/beans.routes'
import { i18nRouter } from './routes/i18n.routes';
import { ENV_PATH, PUBLIC_DIR } from './config/paths'

dotenv.config({ path: ENV_PATH })
const PORT = Number(process.env.PORT) || 3000

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(PUBLIC_DIR))

app.use('/api/beans', beansRouter)
app.use('/api/i18n', i18nRouter)

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
