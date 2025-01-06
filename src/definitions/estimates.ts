enum EstimateUnit {
    Hours = 'h',
    Days = 'd',
    Weeks = 'w',
    Months = 'm',
}

enum EstimateType {
    Min = 'min',
    Probable = 'probable',
    Max = 'max',
}

export interface Estimate {
    value: number
    unit: EstimateUnit
}

export type Estimates = Record<EstimateType, Estimate | undefined>
