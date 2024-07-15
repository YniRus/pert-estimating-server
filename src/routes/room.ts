import { TypedRequestBody } from "@/definitions/common";
import { Response } from "express";
import { Router } from "express";
import {createRoom} from "@/controllers/room";
import {requestError} from "@/utils/response";
import {getRoomAccessUrl} from "@/utils/room";

const router = Router();

type CreateRoomRequest = TypedRequestBody<{
    pin?: string
}>

router.post('/room', async (req: CreateRoomRequest, res: Response) => {
    await createRoom(req.body.pin)
        .then((room) => res.status(200).json({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => res.status(500).json(requestError(error)))
})

export const roomRouter = router