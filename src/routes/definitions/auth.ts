import {TypedRequestBody} from "@/definitions/request";
import {UserRole} from "@/definitions/user";

export interface LoginRequest extends TypedRequestBody<{
    roomId: string
    pin?: string
    role?: UserRole
    name: string
}> {}