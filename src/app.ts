import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import config from 'config'
import connect from './util/dbConnect';
import logger from './util/logger';
import router, { userRouter, authRouter} from './route/index'
import deserializeUser from './middleware/deserializeUser';
const PORT = config.get<number>('PORT')

const app = express();

app.use(express.json())

app.use(deserializeUser)

app.use(router)
app.use(userRouter)
app.use(authRouter)

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
    connect()
})