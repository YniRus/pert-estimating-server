import { Request, Response } from 'express'

export async function pingHandler(req: Request, res: Response) {
    res.sendStatus(200)
}
