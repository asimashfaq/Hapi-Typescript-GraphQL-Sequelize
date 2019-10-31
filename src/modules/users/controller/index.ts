import Boom from 'boom'
import * as jwt from 'jsonwebtoken'
import { BaseHandler } from '../../../helper/baseHandler'
import { hashPassword, validatePassword } from '../../../helper/functions'
import { DbInterface } from '../../../interfaces/DbInterface.d'
import { UserAttributes, UserInstance } from '../model/User'
interface LoginResponse {
    token: string
    user: UserInstance
}
export default class UserController extends BaseHandler {
    constructor(db: DbInterface) {
        super(db)
    }

    public async list(): Promise<UserInstance[]> {
        return await this.db.User.findAll()
    }
    public async get(id: number): Promise<UserInstance> {
        let transaction

        try {
            transaction = await this.db.sequelize.transaction()
            const user = await this.db.User.findByPk(id)
            if (!user) {
                throw Boom.notFound('User not found!')
            }
            await transaction.commit()
            return user
        } catch (err) {
            if (transaction) {
                await transaction.rollback()
            }
            throw err
        }
    }
    public async create(user: UserAttributes): Promise<UserInstance> {
        user.password = hashPassword(user.password)
        const newUser = await this.db.User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            country: user.country,
            email: user.email,
            password: user.password
        })
        return newUser
    }

    public async login(
        email: string,
        password: string
    ): Promise<LoginResponse> {
        let transaction

        try {
            transaction = await this.db.sequelize.transaction()
            const user = await this.db.User.findOne({
                where: {
                    email: email
                }
            })
            if (!user) {
                throw Boom.notFound('User not found!')
            }
            await transaction.commit()
            const isValid = validatePassword(password, user.password)
            if (isValid) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.email
                    },
                    'my-secret-from-env-file-in-prod',
                    {
                        expiresIn: '30d'
                    }
                )
                await this.db.Token.create({
                    token: token,
                    userId: user.id as number
                })
                return {
                    token,
                    user
                }
            } else {
                throw Boom.forbidden('Invalid Username Or Password ')
            }
        } catch (err) {
            if (transaction) {
                await transaction.rollback()
            }
            throw err
        }
    }
}
