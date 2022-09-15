import mongoose from "mongoose";
import config from 'config'
import logger from "./logger";

export default async function connect() {
    const dbUri = config.get<string>('dataBaseUri')
    try {
        await mongoose.connect(dbUri)
        logger.info('Connect')
    } catch(err) {
        logger.error(err)
        process.exit(1)
    }
}