import { Socket } from 'socket.io'
import { SocketMiddlewareNextFunction } from '@ws/definitions/socket-io'
import { AppData } from '@/definitions/app'

export default function (socket: Socket, next: SocketMiddlewareNextFunction) {
    const namespace = socket.request.headers['x-app-namespace']
    const subspace = socket.request.headers['x-app-subspace']

    const app: AppData = {
        namespace: typeof namespace === 'string' ? namespace : undefined,
        subspace: typeof subspace === 'string' ? subspace : undefined,
    }

    socket.data = { ...socket.data, app }

    return next()
}
