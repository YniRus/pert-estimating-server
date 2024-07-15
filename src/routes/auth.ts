import { TypedRequestBody } from "@/definitions/common";
import { Response } from "express";
import { Router } from "express";
import {Room} from "@/definitions/room";
import {getRoomUserAuthToken, getStoragePin} from "@/utils/room";
import storage from "@/lib/storage";
import {storeUser} from "@/controllers/user";
import {UserRole} from "@/definitions/user";
import {joinRoom} from "@/controllers/room";

const router = Router();

type LoginRequest = TypedRequestBody<{
    roomId: string
    pin?: string
    role?: UserRole
    name: string
}>

router.post('/login', async (req: LoginRequest, res: Response) => {
    const room = await storage.getItem<Room>(`rooms:${req.body.roomId}`)

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

    const user = await storeUser(req.body.name, req.body.role)
    await joinRoom(room, user.uid)

    const authToken = getRoomUserAuthToken(room, user)

    res
        .cookie('authToken', authToken)
        .cookie('user', user.uid)
        .sendStatus(200)
})

export const authRouter = router