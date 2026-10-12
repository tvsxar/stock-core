export interface StockMovement {
    id: number;
    type: "IN" | "OUT";
    quantity: number;
    occurred_at: string;
};

export type ActionType = "edit" | "receive" | "writeoff";
