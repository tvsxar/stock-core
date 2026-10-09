import { Link } from "react-router";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import type { Product } from "../../types/products";

interface ProductDetailsHeaderProps {
    product: Product;
    onEdit: () => void;
}

function ProductDetailsHeader({
    product,
    onEdit,
}: ProductDetailsHeaderProps) {
    return (
        <div className="space-y-6">
            <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
                <ArrowLeft size={17} />
                Back to products
            </Link>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                        <Package size={26} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {product.name}
                        </h1>

                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-slate-500">
                                Product #{product.id}
                            </span>

                            <span className="text-slate-300">•</span>

                            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
                                {product.sku}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                    <Pencil size={16} />
                    Edit product
                </button>
            </div>
        </div>
    );
}

export default ProductDetailsHeader;
