import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface.d'
import UserController from '../../modules/users/controller'
import { UserInstance } from '../../modules/users/model/User'
const resolvers: IResolvers = {
    Query: {
        users: async (_, __, { db }: { db: DbInterface }) => {
            return await new UserController(db).list()
        },
        user: async (_, { id }, { db }: { db: DbInterface }) => {}
    },
    Mutation: {
        createUser: async (
            _,
            { input }: { input: UserInstance },
            { db }: { db: DbInterface }
        ) => {
            const user = await new UserController(db).create(input)
            return user
        },
        login: async (_, { email, password }, { db }: { db: DbInterface }) => {
            const result = await new UserController(db).login(email, password)
            return result
        }
    }
}

export default resolvers
