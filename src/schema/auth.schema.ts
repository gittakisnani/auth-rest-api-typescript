import { object, string, TypeOf } from 'zod'

export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email('Email not valid'),
        password: string({ 
            required_error: 'Password is required'
        }).min(6, 'Password should be 6 chars minimum')
    })
})

export type CreateSessionType = TypeOf<typeof createSessionSchema>['body']