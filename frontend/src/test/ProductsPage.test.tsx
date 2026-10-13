import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProductsPage from "../pages/ProductsPage";
import { getProducts } from "../api/products";

vi.mock("../api/products", () => ({
    getProducts: vi.fn()
}));

describe("ProductsPage test", () => {
    const mockProducts = [
        { id: 1, name: "MacBook Pro", sku: "MAC-001", stock: 10 },
        { id: 2, name: "iPhone 17", sku: "IPH-002", stock: 5 }
    ];

    it("should display products fetched from API", async () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });
        vi.mocked(getProducts).mockResolvedValue(mockProducts);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProductsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const phoneHeading = await screen.findByText("iPhone 17");
        const laptopHeading = await screen.findByText("MacBook Pro");

        expect(phoneHeading).toBeInTheDocument();
        expect(laptopHeading).toBeInTheDocument();
    });

    it("should filter products by name and SKU", async () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });
        const user = userEvent.setup();
        vi.mocked(getProducts).mockResolvedValue(mockProducts);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProductsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByText("iPhone 17");

        const searchInput = screen.getByPlaceholderText("Search products...");
        await user.type(searchInput, "mac");

        const phoneHeading = screen.queryByText("iPhone 17");
        const laptopHeading = screen.queryByText("MacBook Pro");

        expect(phoneHeading).not.toBeInTheDocument();
        expect(laptopHeading).toBeInTheDocument();

        await user.clear(searchInput);
        await user.type(searchInput, "iph-002");

        expect(screen.getByText("iPhone 17")).toBeInTheDocument();
        expect(screen.queryByText("MacBook Pro")).not.toBeInTheDocument();
    })
})
