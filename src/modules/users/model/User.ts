import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'
import { TokenAttributes, TokenInstance } from '../../token/model/Token'

export interface UserAttributes {
    id?: number
    firstName: string
    lastName: string
    age: number
    email: string
    password: string
    country: string
    tokens?: TokenAttributes[] | TokenAttributes['id'][]
    createdAt?: Date
    updatedAt?: Date
}

export interface UserInstance
    extends Sequelize.Instance<UserAttributes>,
        UserAttributes {
    getTokens: Sequelize.HasManyGetAssociationsMixin<TokenInstance>
}

export const UserFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<UserAttributes> = {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        age: DataTypes.INTEGER,
        country: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }

    const User = sequelize.define<UserInstance, UserAttributes>(
        'User',
        attributes
    )
    User.associate = (models): void => {
        User.hasMany(models.Token, { foreignKey: 'userId', as: 'tokens' })
    }

    return User
}
