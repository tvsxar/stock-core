export class InvalidMovementDateError extends Error {
  constructor() {
    super("Movement date cannot be in the future!");
  }
}

export class InsufficientStockError extends Error {
  constructor(currentStock: number, quantity: number) {
    super(
      `Insufficient stock. Available: ${currentStock}, requested: ${quantity}.`,
    );
  }
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produt with this id was not found");
  }
}
