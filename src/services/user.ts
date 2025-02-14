import { randomUUID } from 'node:crypto'
import { User, UserPublic, UserRaw, UserRole } from '@/definitions/user'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'
import { createEstimates, getEstimates } from '@/services/estimate'
import { truthy } from '@/utils/utils'

export async function createUser(name: string, role?: UserRole) {
    const user: UserRaw = {
        id: randomUUID(),
        name,
        role,
        estimates: (await createEstimates()).id,
    }

    await storage.setItem(`users:${user.id}`, user)

    return user
}

export async function getUserRaw(id: UID) {
    return await storage.getItem<UserRaw>(`users:${id}`)
}

export async function getUserPublic(id: UID): Promise<UserPublic | null> {
    const user = await getUserRaw(id)

    if (user) {
        delete (user as Partial<UserRaw>).estimates
    }

    return user
}

export async function getUser(id: UID, withOpenEstimates?: boolean): Promise<User | null> {
    const user = await getUserRaw(id)
    if (!user) return user

    return {
        ...user,
        estimates: await getEstimates(user.estimates, withOpenEstimates),
    }
}

export async function getUserEstimatesIds(users: UID[]) {
    return (await Promise.all(users.map(async (user) => {
        return (await getUserRaw(user))?.estimates
    }))).filter(truthy)
}
