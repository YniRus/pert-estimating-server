import {Response} from "express";
import {getStoragePin} from "@/utils/room";
import {getRoom, joinRoom} from "@/services/room";
import {LoginRequest} from "@/routes/definitions/auth";
import {getRoomUserAuthToken} from "@/utils/auth";
import {createUser} from "@/services/user";

export async function loginHandler(req: LoginRequest, res: Response) {
    const room = await getRoom(req.body.roomId)

    if (!room) {
        return res.sendStatus(404)
    }

    if (room.pin) {
        if (req.body.pin) {
            if (![req.body.pin, getStoragePin(req.body.pin)].includes(room.pin)) {
                return res.sendStatus(400)
            }
        } else {
            return res.sendStatus(403)
        }
    }

    const user = await createUser(req.body.name, req.body.role)
    await joinRoom(room, user.uid)

    const authToken = getRoomUserAuthToken(room, user.uid)

    res
        .cookie('authToken', authToken)
        .cookie('user', user.uid)
        .sendStatus(200)
}