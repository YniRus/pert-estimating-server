import { randomUUID } from 'node:crypto'
import { User, UserRole } from '@/definitions/user'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'

export async function createUser(name: string, role?: UserRole) {
    const user: User = {
        uid: randomUUID(),
        name,
        role,
    }

    await storage.setItem(`users:${user.uid}`, user)

    return user
}

export async function getUser(uid: UID) {
    return await storage.getItem<User>(`users:${uid}`)
}
