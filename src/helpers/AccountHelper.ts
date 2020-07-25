
import { Request, Response, NextFunction } from 'express'
import jwt from 'jwt-simple'

import config from '../config'

import User from '../models/User'

class AccountHelper {

    constructor() {

    }

    static getToken(headers: any): any {

        if (!headers || !headers.authorization) return null

        const parted = headers.authorization.split(' ')

        if (parted.length !== 2) return null

        return parted[1]
    }

    static async getUser(req: Request): Promise<any> {

        const token = AccountHelper.getToken(req.headers)

        if (!token) return false

        try {
            
            const _id = jwt.decode(token, config.security.passport_secret || '')

            const user = await User.findById(_id)

            if (!user) return false

            return user
        } catch (error) {
            
            return false
        }
    }

    async isAuthenticated(req: Request, res: Response, next: NextFunction) {

        const user = await AccountHelper.getUser(req)

        if (!user) {
            
            res.status(401)
            res.json({
                error: 'Not authenticated'
            })

            return
        }

        next()
    }
}

export default new AccountHelper()
