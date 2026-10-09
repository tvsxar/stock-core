import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../api/products";
import { getStockMovements } from "../api/stockMovements";
import ProductDetailsHeader from "../components/product-details/ProductDetailsHeader";
import ProductOverview from "../components/product-details/ProductOverview";
import StockMovementsTable from "../components/product-details/StockMovementsTable";
import StockMovementModal from "../components/product-details/StockMovementModal";
import EditProductModal from "../components/product-details/EditProductModal";
import type { StockMovement, ActionType } from "../types/stockMovements";
import type { Product } from "../types/products";

function ProductDetailsPage() {
    const [activeModal, setActiveModal] = useState<ActionType | null>(null);

    const { id } = useParams();
    const productId = Number(id);

    const isValidId = id !== undefined && Number.isInteger(productId) && productId > 0;

    const product = useQuery<Product>({
        queryKey: ["products", productId],
        queryFn: () => getProductById(productId),
        enabled: isValidId,
    });
    const movements = useQuery<StockMovement[]>({
        queryKey: ["products", productId, "movements"],
        queryFn: () => getStockMovements(productId),
        enabled: isValidId,
    })

    const closeModal = () => setActiveModal(null);

    if (!isValidId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-lg font-semibold text-red-600">
                    Invalid product ID
                </p>
            </div>
        );
    }

    if (product.isError || movements.isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-lg font-semibold text-red-600">
                    Error: {(product.error || movements.error)?.message}
                </p>
            </div>
        );
    }

    if (product.isPending || movements.isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-lg font-semibold text-slate-700">
                    Loading product details...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-7xl space-y-7 px-6 py-10">
                <ProductDetailsHeader
                    product={product.data}
                    onEdit={() => setActiveModal("edit")}
                />

                <ProductOverview
                    product={product.data}
                    movements={movements.data}
                    onReceive={() => setActiveModal("receive")}
                    onWriteOff={() => setActiveModal("writeoff")}
                />

                <StockMovementsTable movements={movements.data} />
            </main>

            {activeModal === "edit" && (
                <EditProductModal
                    product={product.data}
                    closeModal={closeModal}
                />
            )}

            {(activeModal === "receive" || activeModal === "writeoff") && (
                <StockMovementModal
                    type={activeModal}
                    product={product.data}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default ProductDetailsPage;
