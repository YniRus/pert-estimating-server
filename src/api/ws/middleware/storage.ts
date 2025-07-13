import { Socket } from 'socket.io'
import { SocketMiddlewareNextFunction } from '@ws/definitions/socket-io'
import baseStorage, { prefixStorage } from '@/lib/storage'

export default function (socket: Socket, next: SocketMiddlewareNextFunction) {
    const { namespace, subspace } = socket.data.app

    let storage = baseStorage

    if (namespace) storage = prefixStorage(storage, namespace)
    if (subspace) storage = prefixStorage(storage, subspace)

    socket.data = { ...socket.data, storage }

    return next()
}
