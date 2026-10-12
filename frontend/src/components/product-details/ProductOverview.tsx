import {
    Package,
    ArrowDownToLine,
    ArrowUpFromLine,
    Activity,
    Plus,
    Minus,
} from "lucide-react";

import type { StockMovement } from "../../types/stockMovements";

interface ProductOverviewProps {
    product: {
        stock: number;
    };
    movements: StockMovement[];
    onReceive: () => void;
    onWriteOff: () => void;
}

function ProductOverview({
    product,
    movements,
    onReceive,
    onWriteOff,
}: ProductOverviewProps) {
    const totalReceived = movements
        .filter((movement) => movement.type === "IN")
        .reduce((sum, movement) => sum + movement.quantity, 0);

    const totalDispatched = movements
        .filter((movement) => movement.type === "OUT")
        .reduce((sum, movement) => sum + movement.quantity, 0);

    const status =
        product.stock === 0
            ? "Out of Stock"
            : product.stock <= 10
              ? "Low Stock"
              : "In Stock";

    const statusClasses =
        product.stock === 0
            ? "bg-rose-50 text-rose-700"
            : product.stock <= 10
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700";

    const cards = [
        {
            label: "Current Stock",
            value: product.stock,
            icon: Package,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Received",
            value: totalReceived,
            icon: ArrowDownToLine,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Dispatched",
            value: totalDispatched,
            icon: ArrowUpFromLine,
            color: "bg-orange-50 text-orange-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    {card.label}
                                </p>

                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
                                >
                                    <Icon size={19} />
                                </div>
                            </div>

                            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                {card.value.toLocaleString()}
                            </p>

                            {card.label === "Current Stock" && (
                                <span
                                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`}
                                >
                                    {status}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Activity size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Stock Operations
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Receive new inventory or write off existing stock.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onWriteOff}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <Minus size={16} />
                        Write Off
                    </button>

                    <button
                        type="button"
                        onClick={onReceive}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Receive Stock
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductOverview;
