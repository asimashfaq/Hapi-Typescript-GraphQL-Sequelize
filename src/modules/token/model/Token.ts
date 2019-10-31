import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface TokenAttributes {
    id?: number
    token: string
    userId: number
}
export interface TokenInstance
    extends Sequelize.Instance<TokenInstance>,
        TokenAttributes {}
export const TokenFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<TokenAttributes> = {
        token: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }
    const Token = sequelize.define<TokenInstance, TokenAttributes>(
        'Token',
        attributes
    )
    Token.associate = (models): void => {
        Token.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User'
        })
    }
    return Token
}
