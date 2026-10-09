import { useState } from "react";
import ProductDetailsHeader from "../components/product-details/ProductDetailsHeader";
import ProductOverview from "../components/product-details/ProductOverview";
import StockMovementsTable from "../components/product-details/StockMovementsTable";
import StockMovementModal from "../components/product-details/StockMovementModal";
import EditProductModal from "../components/product-details/EditProductModal";
import type { StockMovement, ActionType } from "../types/stockMovements";

const mockProduct = {
    id: 1,
    sku: "MOUSE-001",
    name: "Wireless Mouse",
    stock: 85,
};

const mockMovements: StockMovement[] = [
    { id: 1, type: "IN", quantity: 100, occurred_at: "2026-10-08T10:30:00Z" },
    { id: 2, type: "OUT", quantity: 10, occurred_at: "2026-10-08T14:20:00Z" },
    { id: 3, type: "OUT", quantity: 5, occurred_at: "2026-10-09T09:15:00Z" },
];

function ProductDetailsPage() {
    const [activeModal, setActiveModal] = useState<ActionType | null>(null);

    const closeModal = () => setActiveModal(null);

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-7xl space-y-7 px-6 py-10">
                <ProductDetailsHeader
                    product={mockProduct}
                    onEdit={() => setActiveModal("edit")}
                />

                <ProductOverview
                    product={mockProduct}
                    movements={mockMovements}
                    onReceive={() => setActiveModal("receive")}
                    onWriteOff={() => setActiveModal("writeoff")}
                />

                <StockMovementsTable movements={mockMovements} />
            </main>

            {activeModal === "edit" && (
                <EditProductModal
                    product={mockProduct}
                    closeModal={closeModal}
                />
            )}

            {(activeModal === "receive" || activeModal === "writeoff") && (
                <StockMovementModal
                    type={activeModal}
                    product={mockProduct}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default ProductDetailsPage;
