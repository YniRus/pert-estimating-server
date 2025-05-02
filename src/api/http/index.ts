import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import appData from '@/api/http/middleware/app'
import cors from 'cors'
import router from '@http/routes'
import { createServer } from 'node:http'
import { getCorsOptions } from '@/lib/cors'

export default function () {
    const app = express()
    const server = createServer(app)

    app.use(appData)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(cors(getCorsOptions()))
    app.use(router)

    server.listen(process.env.APP_PORT, () => {
        console.log(`[server]: Server is running at http://localhost:${process.env.APP_PORT}`)
    })

    return server
}
