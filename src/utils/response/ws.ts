import { RequestError } from '@/utils/response/response'
import { Socket } from 'socket.io'

export default <T extends Socket>(socket: T) => ({
    emit(event: string, data: unknown) {
        return socket.emit(event, data)
    },

    error(error: RequestError, event = 'error') {
        return socket.emit(event, error.response)
    },
})
