import { TypedRequestBody } from "@/definitions/common";
import { Response } from "express";
import { Router } from "express";
import {randomUUID} from "node:crypto";
import {Room} from "@/definitions/room";
import {getStoragePin} from "@/utils/room";
import storage from "@/lib/storage";

const router = Router();

type CreateRoomRequest = TypedRequestBody<{
    pin?: string
}>

router.post('/room', async (req: CreateRoomRequest, res: Response) => {
    const room: Room = {
        uid: randomUUID(),
    }

    if (req.body.pin) {
        room.pin = getStoragePin(req.body.pin)
    }

    await storage.setItem(`rooms:${room.uid}`, room)
        .then(() => res.status(200).json({ roomId: room.uid }))
        .catch((error: Error) => res.status(500).json({ error }))
})

export const roomRouter = router