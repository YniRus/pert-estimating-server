import { Server, Socket } from '@ws/definitions/socket-io'
import roomHandler from '@ws/handlers/room'

export default function (io: Server, socket: Socket) {
    const handler = roomHandler(io, socket)

    handler.onConnect()

    socket.on('query:room', handler.getRoomInfo)

    socket.on('mutation:room-estimates-visible', handler.setRoomEstimatesVisible)
    socket.on('mutation:room-delete-estimates', handler.deleteRoomEstimates)

    socket.on('disconnecting', handler.beforeDisconnect)
}
