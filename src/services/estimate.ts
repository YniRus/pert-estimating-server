import { randomUUID } from 'node:crypto'
import storage from '@/lib/storage'
import { Estimate, HIDDEN_ESTIMATE, Estimates, EstimatesRaw, EstimateType } from '@/definitions/estimates'
import { UID } from '@/definitions/aliases'

export async function createEstimates() {
    const estimates: EstimatesRaw = getEmptyEstimatesRaw(randomUUID())

    await setEstimateRaw(estimates)

    return estimates
}

async function getEstimatesRaw(id: UID) {
    return await storage.getItem<EstimatesRaw>(`estimates:${id}`) || getEmptyEstimatesRaw(id)
}

function getEmptyEstimatesRaw(id: UID): EstimatesRaw {
    return {
        id,
        estimates: {},
    }
}

export async function getEstimates(id: UID, open?: boolean) {
    const estimates = await getEstimatesRaw(id)

    if (!open) {
        estimates.estimates = hideEstimates(estimates.estimates)
    }

    return estimates.estimates
}

export function hideEstimates(estimates: Estimates): Estimates {
    return Object.fromEntries(
        Object.entries(estimates)
            .map(([key]) => [key, HIDDEN_ESTIMATE]),
    )
}

async function setEstimateRaw(estimates: EstimatesRaw) {
    await storage.setItem(`estimates:${estimates.id}`, estimates)
}

export async function setEstimate(id: UID, type: EstimateType, estimate: Estimate) {
    const estimates = await getEstimatesRaw(id)

    estimates.estimates[type] = estimate

    await setEstimateRaw(estimates)

    return estimates.estimates
}
