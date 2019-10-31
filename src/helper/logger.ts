import * as DotEnv from 'dotenv'
import * as Winston from 'winston'
import RotateFile from 'winston-daily-rotate-file'

export class ApiLogger {
    public static newInstance = (): Winston.Logger => {
        DotEnv.config()
        const consoleLevel = process.env.LOG_LEVEL || 'debug'

        const logFormat = Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.align(),
            Winston.format.printf(info => {
                const { timestamp, level, message } = info
                const ts = timestamp.slice(0, 19).replace('T', ' ')
                const messageFormat =
                    typeof message === 'object'
                        ? JSON.stringify(message)
                        : message
                return JSON.stringify({
                    messageFormat,
                    level,
                    createdAt: timestamp,
                    createdAtFormated: ts
                })
            })
        )

        return Winston.createLogger({
            format: logFormat,
            transports: [
                new RotateFile({
                    filename: `./logs/${process.env.APP_NAME || 'app'}.log`,
                    datePattern: 'YYYY-MM-DD'
                }),
                new Winston.transports.Console({
                    level: consoleLevel
                })
            ]
        })
    }
}

export default ApiLogger.newInstance()
