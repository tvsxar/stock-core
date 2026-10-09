import { Plus, Layers3 } from "lucide-react";

interface ProductsHeaderProps {
    setIsAddModalOpen: (isOpen: boolean) => void;
}

function ProductsHeader({ setIsAddModalOpen }: ProductsHeaderProps) {
    return (
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Layers3 size={15} />
                    <span>Workspace</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-700">Inventory</span>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Inventory overview
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Manage your products and keep track of inventory levels.
                </p>
            </div>

            <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(37,99,235,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-[0_8px_22px_rgba(37,99,235,0.22)]"
            >
                <Plus size={18} strokeWidth={2.4} />
                Add product
            </button>
        </div>
    )
}

export default ProductsHeader;
