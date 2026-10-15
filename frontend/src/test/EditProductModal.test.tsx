import { describe, it, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { updateProductName } from "../api/products";
import EditProductModal from "../components/product-details/EditProductModal";

vi.mock("../api/products", () => ({
    updateProductName: vi.fn()
}));

describe("EditProductModal", () => {
    it("should update product name and close modal on success", async () => {
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
        vi.mocked(updateProductName).mockResolvedValue({
            id: 1,
            name: "MacBook Air",
            sku: "MAC-001",
            stock: 0
        });

        render(
            <QueryClientProvider client={queryClient}>
                <EditProductModal product={product} closeModal={closeModal} />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        const nameInput = screen.getByLabelText(/Product name/i);
        const submitButton = screen.getByRole("button", { name: "Save Changes" });

        expect(nameInput).toHaveValue("MacBook Pro");

        await user.clear(nameInput);
        await user.type(nameInput, "  MacBook Air  ");
        await user.click(submitButton);

        await waitFor(() => {
            expect(closeModal).toHaveBeenCalled();
        });
        expect(updateProductName).toHaveBeenCalledWith({ name: "MacBook Air", id: product.id }, expect.anything());
        expect(closeModal).toHaveBeenCalledTimes(1);
    })
})
