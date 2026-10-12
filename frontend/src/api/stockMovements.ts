import type { StockMovement } from "../types/stockMovements";

export async function getStockMovements(id: number): Promise<StockMovement[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${id}/movements`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch movements");
  }

  const data: { movements: StockMovement[] } = await response.json();

  return data.movements;
}

export async function createStockMovement(movement: {
  id: number;
  type: "IN" | "OUT";
  quantity: number;
  occurred_at: Date;
}): Promise<StockMovement> {
  const { id, type, quantity, occurred_at } = movement;

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${id}/movements`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, quantity, occurred_at }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create movement");
  }

  const data: { movement: StockMovement } = await response.json();

  return data.movement;
}
