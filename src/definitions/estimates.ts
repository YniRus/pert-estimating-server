import { UID } from '@/definitions/aliases'

enum EstimateUnit {
    Hours = 'h',
    Days = 'd',
    Weeks = 'w',
    Months = 'm',
}

export enum EstimateType {
    Min = 'min',
    Probable = 'probable',
    Max = 'max',
}

export interface Estimate {
    value: number
    unit: EstimateUnit
}

export const HIDDEN_ESTIMATE = '*'

export type Estimates = Partial<Record<EstimateType, Estimate | typeof HIDDEN_ESTIMATE>>

export interface EstimatesRaw {
    id: UID
    estimates: Estimates
}
