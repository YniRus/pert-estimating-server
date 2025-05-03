import { randomUUID } from 'node:crypto'
import { Estimate, HIDDEN_ESTIMATE, Estimates, EstimatesRaw, EstimateType } from '@/definitions/estimates'
import { UID } from '@/definitions/aliases'
import { ServiceContext } from '@/definitions/context'

export function getEmptyEstimates(): Estimates {
    return {}
}

export function hideEstimates(estimates: Estimates): Estimates {
    return Object.fromEntries(
        Object.entries(estimates)
            .map(([key]) => [key, HIDDEN_ESTIMATE]),
    )
}

function getEmptyEstimatesRaw(id: UID): EstimatesRaw {
    return {
        id,
        estimates: getEmptyEstimates(),
    }
}

export default ({ storage }: ServiceContext) => ({
    async createEstimates() {
        const estimates: EstimatesRaw = getEmptyEstimatesRaw(randomUUID())

        await this.setEstimateRaw(estimates)

        return estimates
    },

    async getEstimatesRaw(id: UID) {
        return await storage.getItem<EstimatesRaw>(`estimates:${id}`) || getEmptyEstimatesRaw(id)
    },

    async getEstimates(id: UID, open?: boolean) {
        const estimates = await this.getEstimatesRaw(id)

        if (!open) {
            estimates.estimates = hideEstimates(estimates.estimates)
        }

        return estimates.estimates
    },

    async setEstimateRaw(estimates: EstimatesRaw) {
        await storage.setItem(`estimates:${estimates.id}`, estimates)
        return estimates
    },

    async setEstimate(id: UID, type: EstimateType, estimate: Estimate) {
        const estimates = await this.getEstimatesRaw(id)

        estimates.estimates[type] = estimate

        return (await this.setEstimateRaw(estimates)).estimates
    },

    async resetEstimates(id: UID) {
        await this.setEstimateRaw(getEmptyEstimatesRaw(id))
    },
})
