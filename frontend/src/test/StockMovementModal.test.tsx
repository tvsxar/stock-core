import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createStockMovement } from "../api/stockMovements";
import StockMovementModal from "../components/product-details/StockMovementModal";

vi.mock("../api/stockMovements", () => ({
    createStockMovement: vi.fn()
}));

describe("StockMovementModal", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should receive stock and close modal on success", async () => {
        const closeModal = vi.fn();
        const product = {
            id: 1,
            name: "MacBook Pro",
            sku: "MAC-001",
            stock: 0
        }

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });
        vi.mocked(createStockMovement).mockResolvedValue({
            id: 1,
            type: "IN",
            quantity: 5,
            occurred_at: new Date().toString()
        })

        render(
            <QueryClientProvider client={queryClient}>
                <StockMovementModal type={"receive"} product={product} closeModal={closeModal} />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        const quantityInput = screen.getByPlaceholderText(/Enter quantity/i);
        const submitButton = screen.getByRole("button", { name: "Receive Stock" });

        await user.type(quantityInput, "5");
        await user.click(submitButton);

        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1);
        });
        expect(createStockMovement).toHaveBeenCalledTimes(1);
        expect(createStockMovement).toHaveBeenCalledWith({
            id: 1,
            type: "IN",
            quantity: 5,
            occurred_at: expect.any(Date)
        }, expect.anything());
    });

    it("should prevent writeoff when quantity exceeds available stock", async () => {
        const closeModal = vi.fn();
        const product = {
            id: 1,
            name: "MacBook Pro",
            sku: "MAC-001",
            stock: 10
        }

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <StockMovementModal type={"writeoff"} product={product} closeModal={closeModal} />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        const quantityInput = screen.getByPlaceholderText(/Enter quantity/i);
        const submitButton = screen.getByRole("button", { name: "Write Off Stock" });

        await user.type(quantityInput, "15");
        await user.click(submitButton);

        expect(screen.getByRole("alert"))
            .toHaveTextContent("Quantity exceeds available stock.");
        expect(createStockMovement).not.toHaveBeenCalled();
        expect(closeModal).not.toHaveBeenCalled();
    })
})
