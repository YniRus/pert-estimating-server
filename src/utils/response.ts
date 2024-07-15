export function requestError(error: Error) {
    return {
        error: {
            message: error.message,
            type: error.name,
        }
    }
}