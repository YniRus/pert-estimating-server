import { Server as SocketIoServer } from 'socket.io'
import { Server as HttpServer } from 'node:http'
import { Socket } from '@ws/definitions/socket-io'
import cookieParser from '@ws/middleware/cookie-parser'
import auth from '@ws/middleware/auth'
import app from '@ws/middleware/app'
import useServiceListeners from '@ws/listeners/service'
import useRoomListeners from '@ws/listeners/room'
import useEstimatesListeners from '@ws/listeners/estimates'
import { getCorsOptions } from '@/lib/cors'

export default function (server: HttpServer) {
    const io = new SocketIoServer(server, {
        cors: getCorsOptions(),
        path: '/io',
    })

    io.use(app)
    io.use(cookieParser)
    io.use(auth)

    io.on('connection', (socket: Socket) => {
        console.log(`User ${socket.data.authTokenPayload.user} [${socket.id}] connected to room ${socket.data.authTokenPayload.room} [${socket.data.app.namespace}:${socket.data.app.subspace}]`)

        useServiceListeners(io, socket)
        useRoomListeners(io, socket)
        useEstimatesListeners(io, socket)

        socket.on('disconnect', () => {
            console.log(`User ${socket.data.authTokenPayload.user} [${socket.id}] disconnected from room ${socket.data.authTokenPayload.room} [${socket.data.app.namespace}:${socket.data.app.subspace}]`)
        })
    })

    return io
}
