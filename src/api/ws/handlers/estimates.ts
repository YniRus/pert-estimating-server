import { Server, Socket, SocketCallbackFunction } from '@ws/definitions/socket-io'
import { Estimate, EstimateType } from '@/definitions/estimates'
import useEstimateService, { hideEstimates } from '@/services/estimate'
import useRoomService from '@/services/room'
import { RequestError } from '@/utils/response'
import { getServiceContext } from '@/utils/context'

export default function (io: Server, socket: Socket) {
    const context = getServiceContext(socket)
    const roomService = useRoomService(context)
    const estimateService = useEstimateService(context)

    return {
        async setEstimate(type: EstimateType, estimate: Estimate, callback: SocketCallbackFunction<true>) {
            const room = await roomService.getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            const estimates = await estimateService.setEstimate(
                socket.data.authTokenPayload.estimates,
                type,
                estimate,
            )

            if (!room.estimatesVisible) {
                estimates.estimates = hideEstimates(estimates.estimates)
            }

            if (socket.rooms.has(socket.data.room.id)) {
                socket.to(socket.data.room.id).emit('on:estimates', socket.data.authTokenPayload.user, estimates.estimates)
            }

            callback(true)
        },

        async confirmEstimates(confirmed: boolean, callback: SocketCallbackFunction<true>) {
            const estimates = await estimateService.setEstimatesConfirmed(socket.data.authTokenPayload.estimates, confirmed)

            if (socket.rooms.has(socket.data.room.id)) {
                socket.to(socket.data.room.id).emit('on:estimates-confirm', socket.data.authTokenPayload.user, !!estimates.confirmed)
            }

            callback(true)
        },
    }
}
