import { Server, Socket } from '@/definitions/socket-io'
import { Estimate, EstimateType } from '@/definitions/estimates'
import { hideEstimates, setEstimate } from '@/services/estimate'

export default function (io: Server, socket: Socket) {
    return {
        async setEstimate(type: EstimateType, estimate: Estimate) {
            let estimates = await setEstimate(
                socket.data.authTokenPayload.estimates,
                type,
                estimate,
            )

            if (!socket.data.room.estimatesVisible) {
                estimates = hideEstimates(estimates)
            }

            socket.to(socket.data.room.id).emit('on:estimates', socket.data.authTokenPayload.user, estimates)
        },
    }
}
