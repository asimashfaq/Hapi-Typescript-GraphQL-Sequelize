import Boom from 'boom'
import Logger from '../helper/logger'
import { DbInterface } from '../interfaces/DbInterface.d'
export abstract class BaseHandler {
    protected db: DbInterface
    constructor(db: DbInterface) {
        this.db = db
    }

    protected respondError(error?: Error): Boom {
        if (!error) {
            return new Boom()
        }

        Logger.debug('Full Error Object:')
        Logger.debug(error)

        if (error.stack) {
            Logger.error('Error Stack:')
            Logger.error(error.stack)
        } else {
            Logger.error('No Error stack to log')
        }

        return new Boom(error)
    }
}
