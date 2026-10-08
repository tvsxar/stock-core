import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PackagePlus, X, CircleAlert, Plus } from "lucide-react";

import { createProduct } from "../api/products";

interface AddProductModalProps {
    closeModal: () => void;
}

function AddProductModal({ closeModal }: AddProductModalProps) {
    const [newSku, setNewSku] = useState("");
    const [newName, setNewName] = useState("");
    const [formError, setFormError] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            closeModal();
        }
    });

    const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (mutation.isPending) return;

        const sku = newSku.trim();
        const name = newName.trim();

        if (!sku || !name) {
            setFormError("Please fill in all required fields.");
            return;
        }

        mutation.mutate({ name, sku });
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
                aria-labelledby="add-product-title"
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15"
            >
                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <PackagePlus size={21} />
                        </div>

                        <div>
                            <h2
                                id="add-product-title"
                                className="text-lg font-semibold tracking-tight text-slate-900"
                            >
                                Add new product
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Create a new inventory item.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={mutation.isPending}
                        onClick={closeModal}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleAddProduct}>
                    <div className="space-y-5 px-6 py-6">
                        <div>
                            <label
                                htmlFor="product-name"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Product name <span className="text-rose-500">*</span>
                            </label>

                            <input
                                id="product-name"
                                type="text"
                                value={newName}
                                onChange={(event) => {
                                    setNewName(event.target.value);
                                    mutation.reset();
                                    setFormError("");
                                }}
                                placeholder="e.g. Mechanical Keyboard"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="product-sku"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                SKU <span className="text-rose-500">*</span>
                            </label>

                            <input
                                id="product-sku"
                                type="text"
                                value={newSku}
                                onChange={(event) => {
                                    setNewSku(event.target.value);
                                    mutation.reset();
                                    setFormError("");
                                }}
                                placeholder="e.g. KB-001"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                A unique identifier for this product.
                            </p>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
                            <CircleAlert
                                size={17}
                                className="mt-0.5 shrink-0 text-blue-500"
                            />

                            <p className="text-xs leading-relaxed text-blue-700">
                                New products start with 0 units in stock. You can receive
                                inventory from the product details page.
                            </p>
                        </div>

                        {formError && (
                            <p role="alert" className="text-sm text-rose-600">
                                {formError}
                            </p>
                        )}

                        {mutation.isError && (
                            <p role="alert" className="text-sm text-rose-600">
                                {mutation.error.message || "An error occurred while creating the product."}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={mutation.isPending}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            {mutation.isPending ? "Creating..." : "Create product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProductModal;
