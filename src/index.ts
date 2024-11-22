/* --- Express & Middlewares --- */
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
/* --- Server --- */
import { createServer } from 'node:http'
import ws from '@/ws'
/* --- Utils & Others --- */
import dotenv from 'dotenv'
import { randomUUID, createHash } from 'node:crypto'

import storage from '@/lib/storage'
import { Room } from '@/definitions/room'

import routes from '@/routes'

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config()

const app = express()
const server = createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
}))

app.get('/', (req: Request, res: Response) => {
    const id = randomUUID()
    const pin = createHash('sha1')
        .update('Привет Мир!')
        .update('gdg')
        .digest('hex')
    res.send(`rand: ${id}. hash ${pin}`)

    const room = {
        id: id,
        pin: pin,
    }

    storage.setItem(`rooms:${id}`, room)
})

app.get('/storage', async (req: Request, res: Response) => {
    const roomsKeys = await storage.getKeys('rooms')
    const rooms = await Promise.all(roomsKeys.map((key) => storage.getItem<Room>(key)))

    res.status(200).json(rooms)
})

app.post('/api', (req, res) => {
    console.log(req.body)
    res.status(200).json({ result: req.body.text })
})

app.use(routes)

/* Start the Express app and listen
 for incoming requests on the specified port */
server.listen(process.env.APP_PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${process.env.APP_PORT}`)
})

ws(server)
