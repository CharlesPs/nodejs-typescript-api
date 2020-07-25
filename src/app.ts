
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import passportJWT from 'passport-jwt'

import config from './config'

import User from './models/User'

import indexRoutes from './routes/indexRoutes'
import usersRoutes from './routes/usersRoutes'
import accountRoutes from './routes/accountRoutes'

class App {

    public app: express.Application
    public passport: any
    
    constructor() {

        this.app = express()
        this.passport = passport

        this.configPassport()
        this.config()
        this.connectDB()
        this.setRoutes()
    }

    public config(): void {

        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(cors())

        this.app.use(this.passport.initialize())
        this.app.use(this.passport.session())
    }

    private configPassport() {

        const opts: any = {}
        opts.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
        opts.secretOrKey = config.security.passport_secret

        this.passport.use(new passportJWT.Strategy(opts, async (jwtData, next) => {

            const user = await User.findById(jwtData.id)

            if (user) {

                next(null, user)
            } else {

                next(null, false)
            }
        }))
    }

    public async connectDB(): Promise<void> {

        mongoose.set('useCreateIndex', true)

        try {
            
            await mongoose.connect(config.database.mongodb, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })

            console.log('Database connection success')
        } catch (error) {
            
            console.log('Database connection failed', error.message)
        }
    }

    public setRoutes(): void {

        this.app.use('/', indexRoutes)
        this.app.use('/users', usersRoutes)
        this.app.use('/account', accountRoutes)
    }
}

export default App
