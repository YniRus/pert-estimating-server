import { Server, Socket, SocketCallbackFunction } from '@ws/definitions/socket-io'
import { Estimate, EstimateType } from '@/definitions/estimates'
import { hideEstimates, setEstimate } from '@/services/estimate'
import { getRoomRaw } from '@/services/room'
import { RequestError } from '@/utils/response'

export default function (io: Server, socket: Socket) {
    return {
        async setEstimate(type: EstimateType, estimate: Estimate, callback: SocketCallbackFunction<true>) {
            const room = await getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            let estimates = await setEstimate(
                socket.data.authTokenPayload.estimates,
                type,
                estimate,
            )

            if (!room.estimatesVisible) {
                estimates = hideEstimates(estimates)
            }

            if (socket.rooms.has(socket.data.room.id)) {
                socket.to(socket.data.room.id).emit('on:estimates', socket.data.authTokenPayload.user, estimates)
            }

            callback(true)
        },
    }
}
