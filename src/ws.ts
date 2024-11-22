import { Server as SocketIoServer } from 'socket.io'
import { Server as HttpServer } from 'node:http'
import cookieParser from '@/middleware/ws/cookie-parser'
import auth from '@/middleware/ws/auth'
import useRoomListeners from '@/listeners/room'

export default function (server: HttpServer) {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.CLIENT_HOST,
            credentials: true,
        },
        path: '/io',
    })

    io.on('connection', (socket) => {
        console.log('a user connected')

        useRoomListeners(io, socket)

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })

    io.use(cookieParser)
    io.use(auth)
}
