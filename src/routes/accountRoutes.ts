
import { Request, Response, Router } from 'express'
import jwt from 'jwt-simple'

import AccountHelper from '../helpers/AccountHelper'
import config from '../config'
import User from '../models/User'

class AccountRoutes {

    router: Router

    constructor() {

        this.router = Router()

        this.setRoutes()
    }

    setRoutes(): void {

        this.router.post('/login', this.login)
        this.router.post('/register', this.register)
    }

    async login(req: Request, res: Response): Promise<void> {

        const {
            username,
            password
        } = req.body

        if (!username || !password) {

            res.json({
                error: 'Missing data'
            })
            return
        }

        try {
            
            const user: any = await User.findOne({ username })

            if (!user) {

                res.json({
                    error: 'User not found'
                })
                return
            }

            const isPassword = await user.comparePassword(password)

            if (!isPassword) {

                res.json({
                    error: 'Wrong credentials'
                })
                return
            }

            const token = jwt.encode(user._id, config.security.passport_secret || '')

            res.json({
                data: {
                    token
                }
            })
        } catch (error) {
            
            res.status(500)
            res.json({
                error: error.message
            })
        }
    }

    async register(req: Request, res: Response): Promise<void> {

        const {
            username,
            password,
            email,
            name,
            paternalSurname,
            maternalSurname
        } = req.body

        if (!name || !paternalSurname || !email || !password) {

            res.json({
                error: 'Missing data'
            })
            return
        }

        try {
            
            const newUser = new User({
                username,
                password,
                email,
                name,
                paternalSurname,
                maternalSurname
            })

            await newUser.save()

            res.json({
                data: newUser
            })
        } catch (error) {
            
            res.status(500)
            res.json({
                error: error.message
            })
        }
    }
}

export default new AccountRoutes().router
