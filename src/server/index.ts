import * as Hapi from '@hapi/hapi'
import { Request } from '@hapi/hapi'
import { applyMiddleware } from 'graphql-middleware'
import { shield } from 'graphql-shield'
import { makeExecutableSchema } from 'graphql-tools'
import sequelizeConfig from '../db/config/config.json'
import { resolvers, typeDefs } from '../graphql'
import HelloPermission from '../graphql/hello/permission'
import { getUser } from '../helper/authentication.js'
import Logger from '../helper/logger'
import { createModels } from './../db/models/index'
const { ApolloServer } = require('apollo-server-hapi')

const permissions = shield({
    Query: {
        ...HelloPermission
    }
})

export default class Server {
    private static _instance: Hapi.Server

    public static async start(): Promise<Hapi.Server> {
        try {
            const host = this.serverHost()
            const port = this.serverPort()

            const result = await createModels(sequelizeConfig)
            result.db.sequelize.sync()
            const schema = applyMiddleware(
                makeExecutableSchema({
                    typeDefs,
                    resolvers
                }),
                permissions
            )

            const apolloserver = new ApolloServer({
                schema,
                context: async (request: Request) => {
                    return {
                        ...request,
                        db: result.db,
                        enforcer: result.enforcer,
                        user: await getUser(result.db, request)
                    }
                }
            })
            Server._instance = new Hapi.Server({
                port,
                routes: {
                    cors: {
                        origin: ['*'], // an array of origins or 'ignore'
                        headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers'
                        exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
                        additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
                        maxAge: 60,
                        credentials: true // boolean - 'Access-Control-Allow-Credentials'
                    }
                }
            })

            await apolloserver.applyMiddleware({
                app: this._instance
            })
            await apolloserver.installSubscriptionHandlers(
                this._instance.listener
            )

            Logger.info(
                JSON.stringify({
                    user: 'system',
                    message: `Server - Up and running at http://${host}:${port}`
                })
            )

            await Server._instance.start()

            return Server._instance
        } catch (error) {
            Logger.error(
                JSON.stringify({
                    user: 'system',
                    message: `Server - There was something wrong: ${error}`
                })
            )
            throw error
        }
    }

    public static serverPort(): number {
        return typeof process.env.NODE_PORT !== 'undefined'
            ? Number(process.env.NODE_PORT)
            : 3000
    }

    public static serverHost(): string {
        return process.env.SERVER_HOST || 'localhost'
    }
}
