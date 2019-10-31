import Sequelize from 'sequelize/index'
import { TokenAttributes, TokenInstance } from '../modules/token/model/Token'
import { UserAttributes, UserInstance } from '../modules/users/model/User'

export interface DbInterface {
    [key: string]: any
    sequelize: Sequelize.Sequelize
    Sequelize: Sequelize.SequelizeStatic
    User: Sequelize.Model<UserInstance, UserAttributes>
    Token: Sequelize.Model<TokenInstance, TokenAttributes>
}
