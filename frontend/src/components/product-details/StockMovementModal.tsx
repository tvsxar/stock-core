import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    X,
    PackagePlus,
    PackageMinus,
    CircleAlert,
} from "lucide-react";
import { createStockMovement } from '../../api/stockMovements';

import type { Product } from "../../types/products";

interface StockMovementModalProps {
    type: "receive" | "writeoff";
    product: Product;
    closeModal: () => void;
}

function StockMovementModal({
    type,
    product,
    closeModal,
}: StockMovementModalProps) {
    const [quantity, setQuantity] = useState("");
    const [formError, setFormError] = useState("");

    const isReceive = type === "receive";

    const config = {
        receive: {
            title: "Receive Stock",
            description: "Add new inventory to this product.",
            button: "Receive Stock",
            icon: PackagePlus,
        },
        writeoff: {
            title: "Write Off Stock",
            description: "Remove inventory from the current stock.",
            button: "Write Off Stock",
            icon: PackageMinus,
        },
    }[type];

    const Icon = config.icon;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createStockMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            closeModal();
        }
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parsedQuantity = Number(quantity);

        if (!Number.isSafeInteger(parsedQuantity) || parsedQuantity <= 0) {
            setFormError("Enter a valid positive integer.");
            return;
        }

        if (!isReceive && parsedQuantity > product.stock) {
            setFormError("Quantity exceeds available stock.");
            return;
        }

        mutation.mutate({
            id: product.id,
            type: isReceive ? "IN" : "OUT",
            quantity: parsedQuantity,
            occurred_at: new Date(),
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[3px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !mutation.isPending) {
                    closeModal();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-action-title"
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15"
            >
                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Icon size={21} />
                        </div>

                        <div>
                            <h2
                                id="product-action-title"
                                className="text-lg font-semibold tracking-tight text-slate-900"
                            >
                                {config.title}
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {config.description}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={mutation.isPending}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium text-slate-500">
                                Selected Product
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {product.name}
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-slate-400">
                                {product.sku}
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="stock-quantity"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Quantity
                            </label>

                            <input
                                id="stock-quantity"
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(event) => {
                                    setQuantity(event.target.value);
                                    mutation.reset();
                                    setFormError("");
                                }}
                                placeholder="Enter quantity"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                            />
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
                            <CircleAlert
                                size={17}
                                className="mt-0.5 shrink-0 text-blue-500"
                            />

                            <p className="text-xs leading-relaxed text-blue-700">
                                Current stock:{" "}
                                <span className="font-semibold">
                                    {product.stock.toLocaleString()} units
                                </span>
                                .{" "}
                                {isReceive
                                    ? "Received units will be added to the available stock."
                                    : "Written-off units will be deducted from the available stock."}
                            </p>
                        </div>

                        {formError && (
                            <p role="alert" className="text-sm text-rose-600">
                                {formError}
                            </p>
                        )}

                        {mutation.isError && (
                            <p role="alert" className="text-sm text-rose-600">
                                {mutation.error.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                        <button
                            type="button"
                            disabled={mutation.isPending}
                            onClick={closeModal}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className={`inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition-colors ${type === "writeoff"
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            <Icon size={16} />
                            {mutation.isPending ? "Processing..." : config.button}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StockMovementModal;
