import {randomUUID} from "node:crypto";
import {User, UserRole} from "@/definitions/user";
import storage from "@/lib/storage";

export async function storeUser(name: string, role?: UserRole) {
    const user: User = {
        uid: randomUUID(),
        name,
        role,
    }

    await storage.setItem(`users:${user.uid}`, user)

    return user
}