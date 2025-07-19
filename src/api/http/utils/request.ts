import { Request } from 'express'

export function getRequestOrigin(req: Request): string {
    const origin = req.get('Origin')
    if (origin) return origin

    const host = req.get('Host')
    const protocol = req.get('X-Forwarded-Proto') || 'http'

    return `${protocol}://${host}`
}
