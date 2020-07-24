
import { Request, Response, Router } from 'express'

class IndexRoutes {

    router: Router

    constructor() {

        this.router = Router()
        this.setRoutes()
    }

    showIndex(req: Request, res: Response): void {

        res.send('forbidden')
    }

    setRoutes(): void {

        this.router.get('/', this.showIndex)
    }
}

export default new IndexRoutes().router
