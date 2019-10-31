import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface'

const resolvers: IResolvers = {
    Query: {
        hello: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: any },
            info
        ) => {
            console.log(user)
            return 'Hello World'
        }
    }
}
export default resolvers
