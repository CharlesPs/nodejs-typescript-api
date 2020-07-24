
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'

import config from './config'
import indexRoutes from './routes/indexRoutes'
import usersRoutes from './routes/usersRoutes'

class App {

    public app: express.Application
    
    constructor() {

        this.app = express()

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
    }

    public async connectDB(): Promise<void> {

        mongoose.set('useCreateIndex', true)

        try {
            
            await mongoose.connect(config.database.mongodb, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

            console.log('Database connection success')
        } catch (error) {
            
            console.log('Database connection failed', error.message)
        }
    }

    public setRoutes(): void {

        this.app.use('/', indexRoutes)
        this.app.use('/users', usersRoutes)
    }
}

export default App
