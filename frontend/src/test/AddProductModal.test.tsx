import { describe, it, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createProduct } from "../api/products";
import AddProductModal from "../components/products-page/AddProductModal";

vi.mock("../api/products", () => ({
    createProduct: vi.fn()
}));

describe("AddProductModal", () => {
    it("should create a product and close modal on success", async () => {
        const closeModal = vi.fn();

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });
        vi.mocked(createProduct).mockResolvedValue({
            id: 1,
            name: "MacBook Pro",
            sku: "MAC-001",
            stock: 0
        });

        render(
            <QueryClientProvider client={queryClient}>
                <AddProductModal closeModal={closeModal} />
            </QueryClientProvider>
        );

        const user = userEvent.setup();

        const nameInput = screen.getByLabelText(/Product name/i);
        const skuInput = screen.getByLabelText(/SKU/i);
        const submitButton = screen.getByRole("button", { name: "Create product" });

        await user.type(nameInput, "  MacBook Pro  ");
        await user.type(skuInput, "MAC-001");
        await user.click(submitButton);

        await waitFor(() => {
            expect(closeModal).toHaveBeenCalled();
        });
        expect(createProduct).toHaveBeenCalledWith({ name: "MacBook Pro", sku: "MAC-001" }, expect.anything());
        expect(closeModal).toHaveBeenCalledTimes(1);
    })
})

