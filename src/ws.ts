import { Server as SocketIoServer } from 'socket.io'
import { Server as HttpServer } from 'node:http'
import cookieParser from '@/middleware/ws/cookie-parser'
import auth from '@/middleware/ws/auth'
import useRoomListeners from '@/listeners/room'
import useAuthListeners from '@/listeners/auth'
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

    io.on('connection', (socket) => {
        console.log('user connected')

        useAuthListeners(io, socket)
        useRoomListeners(io, socket)
        useEstimatesListeners(io, socket)

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}
