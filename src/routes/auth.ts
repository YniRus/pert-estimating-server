import { TypedRequestBody } from "@/definitions/common";
import { Response } from "express";
import { Router } from "express";
import {Room} from "@/definitions/room";
import {getStoragePin} from "@/utils/room";
import storage from "@/lib/storage";

const router = Router();

type LoginRequest = TypedRequestBody<{
    roomId: string
    pin?: string
    role?: string
    name: string
}>

router.post('/login', async (req: LoginRequest, res: Response) => {
    const room = await storage.getItem<Room>(`rooms:${req.body.roomId}`)

    if (!room) {
        return res.sendStatus(404)
    }

    if (room.pin) {
        if (req.body.pin) {
            if (room.pin !== getStoragePin(req.body.pin)) {
                return res.sendStatus(400)
            }
        } else {
            return res.sendStatus(403)
        }
    }

    // TODO:
    res.status(200).json({
        result: "success", room, body: req.body
    })
})

export const authRouter = router