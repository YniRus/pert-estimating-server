import {NextFunction, Request, Response} from "express";
import {getRoom} from "@/services/room";
import {getRoomUserAuthToken} from "@/utils/auth";
import {AuthMiddlewareLocals} from "@/definitions/response";

export default async function(req: Request, res: Response, next: NextFunction) {
    const authToken = req.cookies.authToken
    const authUserUid = req.cookies.user
    const roomUid = req.params.roomId

    if (!roomUid) return res.sendStatus(400)
    if (!authToken || !authUserUid) return res.sendStatus(403)

    const room = await getRoom(roomUid)
    if (!room) return res.sendStatus(404)

    if (getRoomUserAuthToken(room, authUserUid) !== authToken) return res.sendStatus(403)

    const locals: AuthMiddlewareLocals = {
        authToken,
        authUserUid,
        room,
    }

    res.locals = { ...res.locals, ...locals }

    return next()
}