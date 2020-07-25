
import { Request, Response, Router } from 'express'

import AccountHelper from '../helpers/AccountHelper'
import User from '../models/User'

class UserRoutes {

    router: Router

    constructor() {

        this.router = Router()
        this.setRoutes()
    }

    setRoutes(): void {

        this.router.get('/', AccountHelper.isAuthenticated, this.getResult)
        this.router.get('/:_id', AccountHelper.isAuthenticated, this.getRow)
        this.router.post('/', AccountHelper.isAuthenticated, this.createRow)
        this.router.put('/:_id', AccountHelper.isAuthenticated, this.updateRow)
        this.router.delete('/:_id', AccountHelper.isAuthenticated, this.deleteRow)
    }

    async getResult(req: Request, res: Response): Promise<void> {

        try {
            
            const result = await User.find()

            res.json({ data: result })
        } catch (error) {
            
            console.log('usersRoutes.getResult error', error.message)
        }
    }

    async getRow(req: Request, res: Response): Promise<void> {

        const { _id } = req.params

        try {
            
            const row = await User.findOne({ _id })

            res.json({
                data: row
            })
        } catch (error) {
            
            console.log('usersRoutes.getRow error', error.message)

            res.json({
                error: error.message
            })
        }
    }

    async createRow(req: Request, res: Response): Promise<void> {

        try {
            
            const row = new User(req.body)

            await row.save()

            res.json({data: row})
        } catch (error) {
            
            console.log('usersRoutes.createRow error', error.message)

            res.json({
                error: error.message
            })
        }
    }

    async updateRow(req: Request, res: Response): Promise<void> {

        const { _id } = req.params

        try {
            
            const row = await User.findByIdAndUpdate(_id, req.body, { new: true })

            res.json({
                data: row
            })
        } catch (error) {
            
            res.json({
                error: error.message
            })
        }
    }

    async deleteRow(req: Request, res: Response): Promise<void> {

        const { _id } = req.params

        try {
            
            await User.findByIdAndRemove(_id)

            res.json({
                data: []
            })
        } catch (error) {
            
            res.json({
                error: error.message
            })
        }
    }
}

export default new UserRoutes().router
