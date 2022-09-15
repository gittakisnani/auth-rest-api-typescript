import UserModel, { User } from "../model/user.model";

function createUser(input: Partial<User>) {
    return UserModel.create(input)
}

function findUserById(id: string) {
    return UserModel.findById(id).exec()
}

function findUserByEmail(email: string) {
    return UserModel.findOne({ email }).exec()
}


export {
    createUser,
    findUserById,
    findUserByEmail
}