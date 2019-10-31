import { IResolvers } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import path from 'path'
const resolversTypes: IResolvers[] = fileLoader(
    path.join(__dirname, '**/resolvers.js')
)
const resolvers = mergeResolvers(resolversTypes)
const typesArray = fileLoader(path.join(__dirname, '**/*.graphql'))
const typeDefs = mergeTypes(typesArray, { all: true })

export { resolvers, typeDefs }
