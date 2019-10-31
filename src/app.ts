import * as DotEnv from 'dotenv'
import Logger from './helper/logger'
import Server from './server'
;(async (): Promise<void> => {
    DotEnv.config()
    await Server.start()

    Logger.info({
        user: 'system',
        message: `Hapi server has been started at: http://${Server.serverHost()}:${Server.serverPort()}/`
    })
    console.log(
        `Hapi server has been started at: http://${Server.serverHost()}:${Server.serverPort()}/`
    )
})()
