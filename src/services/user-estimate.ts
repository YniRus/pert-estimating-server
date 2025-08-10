import { ServiceContext } from '@/definitions/context'
import useEstimateService, { getEmptyEstimates, hideEstimates } from '@/services/estimate'
import useUserService, { UserEstimatesReturnType } from '@/services/user'
import { UID } from '@/definitions/aliases'
import { UserEstimates } from '@/definitions/estimates'

export function getEmptyUserEstimates(): UserEstimates {
    return {
        estimates: getEmptyEstimates(),
    }
}

export default ({ storage }: ServiceContext) => ({
    userService: useUserService({ storage }),
    estimateService: useEstimateService({ storage }),

    async getUserEstimates(id: UID, estimatesReturnType?: UserEstimatesReturnType) {
        if (estimatesReturnType === UserEstimatesReturnType.Empty) {
            return getEmptyUserEstimates()
        }

        const estimates = await this.estimateService.getEstimatesPublic(id)

        if (estimatesReturnType !== UserEstimatesReturnType.Open) {
            estimates.estimates = hideEstimates(estimates.estimates)
        }

        return estimates
    },
})
