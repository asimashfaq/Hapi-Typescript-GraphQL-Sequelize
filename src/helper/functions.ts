import * as Bcrypt from 'bcryptjs'
export const hashPassword = (password: string): string => {
    if (!password) {
        return ''
    }

    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8))
}

export const validatePassword = (
    requestPassword: string,
    hashPassword: string
) => {
    return Bcrypt.compareSync(requestPassword, hashPassword)
}
