import { randomUUID } from 'node:crypto'
import { User, UserPublic, UserRaw, UserRole } from '@/definitions/user'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'
import { createEstimates, getEmptyEstimates, getEstimates } from '@/services/estimate'
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

export enum UserEstimatesReturnType {
    Empty,
    Hidden,
    Open,
}

export async function getUser(id: UID, estimatesReturnType?: UserEstimatesReturnType): Promise<User | null> {
    const user = await getUserRaw(id)
    if (!user) return user

    const estimates = estimatesReturnType === UserEstimatesReturnType.Empty
        ? getEmptyEstimates()
        : await getEstimates(user.estimates, estimatesReturnType === UserEstimatesReturnType.Open)

    return { ...user, estimates }
}

export async function getUserEstimatesIds(users: UID[]) {
    return (await Promise.all(users.map(async (user) => {
        return (await getUserRaw(user))?.estimates
    }))).filter(truthy)
}
