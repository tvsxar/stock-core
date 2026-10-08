import { ArrowRight, Package } from "lucide-react";
import type { Product } from "../types/products";

interface ProductRowProps {
    product: Product;
    status: {
        label: string;
        className: string;
        dot: string;
    }
}

function ProductRow({ product, status }: ProductRowProps) {
    return (
        <tr
            key={product.id}
            className="group transition-colors hover:bg-slate-50/70"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
                        <Package size={19} strokeWidth={1.7} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Product #{String(product.id).padStart(4, "0")}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600">
                    {product.sku}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm font-semibold tabular-nums text-slate-800">
                    {product.stock}
                </span>

                <span className="ml-1.5 text-xs text-slate-400">units</span>
            </td>

            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                </span>
            </td>

            <td className="px-6 py-4 text-right">
                <a
                    href={`/products/${product.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                    View details
                    <ArrowRight size={15} />
                </a>
            </td>
        </tr>
    )
}

export default ProductRow;
