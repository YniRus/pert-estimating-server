import { Server as SocketIoServer } from 'socket.io'
import { Server as HttpServer } from 'node:http'
import { Socket } from '@/definitions/socket-io'
import cookieParser from '@/middleware/ws/cookie-parser'
import auth from '@/middleware/ws/auth'
import useServiceListeners from '@/listeners/service'
import useRoomListeners from '@/listeners/room'
import useEstimatesListeners from '@/listeners/estimates'

export default function (server: HttpServer) {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.CLIENT_HOST,
            credentials: true,
        },
        path: '/io',
    })

    io.use(cookieParser)
    io.use(auth)

    io.on('connection', (socket: Socket) => {
        console.log(`User ${socket.data.authTokenPayload.user} [${socket.id}] connected to room ${socket.data.authTokenPayload.room}`)

        useServiceListeners(io, socket)
        useRoomListeners(io, socket)
        useEstimatesListeners(io, socket)

        socket.on('disconnect', () => {
            console.log(`User ${socket.data.authTokenPayload.user} [${socket.id}] disconnected from room ${socket.data.authTokenPayload.room}`)
        })
    })
}
