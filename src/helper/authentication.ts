import { rule } from 'graphql-shield'
import * as jwt from 'jsonwebtoken'
import { DbInterface } from '../interfaces/DbInterface'
import { TokenInstance } from '../modules/token/model/Token'
import Boom = require('boom')
export const isAuthenticated = rule()(
    async (_, __, { user }: { user: any }, info) => {
        return user !== null
    }
)
export const getUser = async (db: DbInterface, r: any): Promise<any> => {
    let token = r.request.headers.authorization || ''
    if (token !== '') {
        token = token.slice(7, token.length).trimLeft()
        const userInfo = await jwt.verify(
            token,
            'my-secret-from-env-file-in-prod',
            async (err: any, decoded: any) => {
                if (err) {
                    throw Boom.badRequest('Token is not valid')
                }
                try {
                    const tokenInfo = (await db.Token.findOne({
                        where: {
                            token: token
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'User'
                            }
                        ]
                    })) as TokenInstance
                    return tokenInfo.toJSON()
                } catch (error) {
                    console.log(error)
                }
            }
        )
        return userInfo
    } else {
        return false
    }
}
