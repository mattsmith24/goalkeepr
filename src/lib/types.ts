export interface Goal {
    id: number;
    description: string;
}

export interface Milestone {
    id: number;
    goalId: number;
    description: string;
}
