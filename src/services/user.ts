import { randomUUID } from 'node:crypto'
import { User, UserPublic, UserRaw, UserRole } from '@/definitions/user'
import { UID } from '@/definitions/aliases'
import useEstimateService, { getEmptyEstimates } from '@/services/estimate'
import { truthy } from '@/utils/utils'
import { ServiceContext } from '@/definitions/context'

export enum UserEstimatesReturnType {
    Empty,
    Hidden,
    Open,
}

export default ({ storage }: ServiceContext) => ({
    async createUser(name: string, role?: UserRole) {
        const user: UserRaw = {
            id: randomUUID(),
            name,
            role,
            estimates: (await useEstimateService({ storage }).createEstimates()).id,
        }

        await storage.setItem(`users:${user.id}`, user)

        return user
    },

    async getUserRaw(id: UID) {
        return await storage.getItem<UserRaw>(`users:${id}`)
    },

    async getUserPublic(id: UID): Promise<UserPublic | null> {
        const user = await this.getUserRaw(id)

        if (user) {
            delete (user as Partial<UserRaw>).estimates
        }

        return user
    },

    async getUser(id: UID, estimatesReturnType?: UserEstimatesReturnType): Promise<User | null> {
        const user = await this.getUserRaw(id)
        if (!user) return user

        const estimates = estimatesReturnType === UserEstimatesReturnType.Empty
            ? getEmptyEstimates()
            : await useEstimateService({ storage }).getEstimates(user.estimates, estimatesReturnType === UserEstimatesReturnType.Open)

        return { ...user, estimates }
    },

    async getUserEstimatesIds(users: UID[]) {
        return (await Promise.all(users.map(async (user) => {
            return (await this.getUserRaw(user))?.estimates
        }))).filter(truthy)
    },
})
