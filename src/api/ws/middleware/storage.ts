import { Socket } from 'socket.io'
import { SocketMiddlewareNextFunction } from '@ws/definitions/socket-io'
import baseStorage, { prefixStorage } from '@/lib/storage'

export default function (socket: Socket, next: SocketMiddlewareNextFunction) {
    const {
        namespace = process.env.APP_NAMESPACE || '_default',
        subspace = process.env.APP_SUBSPACE || '_default',
    } = socket.data.app

    let storage = baseStorage

    if (namespace) storage = prefixStorage(storage, namespace)
    if (subspace) storage = prefixStorage(storage, subspace)

    socket.data = { ...socket.data, storage }

    return next()
}
