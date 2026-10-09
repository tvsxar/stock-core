import {
    ArrowDownLeft,
    ArrowUpRight,
    History,
    Inbox,
} from "lucide-react";

import type { StockMovement } from "../../types/stockMovements";

interface StockMovementsTableProps {
    movements: StockMovement[];
}

function StockMovementsTable({
    movements,
}: StockMovementsTableProps) {
    const sortedMovements = [...movements].sort(
        (a, b) =>
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime()
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <History size={19} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Stock Movement History
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Track all inventory changes for this product.
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {movements.length} movements
                </span>
            </div>

            {sortedMovements.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Inbox size={26} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-800">
                        No stock movements yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Inventory movements will appear here after your first
                        stock operation.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80">
                            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">Movement</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4 text-right">ID</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {sortedMovements.map((movement) => {
                                const isIncoming = movement.type === "IN";

                                return (
                                    <tr
                                        key={movement.id}
                                        className="transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                        isIncoming
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-orange-50 text-orange-600"
                                                    }`}
                                                >
                                                    {isIncoming ? (
                                                        <ArrowDownLeft size={18} />
                                                    ) : (
                                                        <ArrowUpRight size={18} />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {isIncoming
                                                            ? "Stock Received"
                                                            : "Stock Dispatched"}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        {isIncoming
                                                            ? "Incoming inventory"
                                                            : "Outgoing inventory"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-sm font-semibold ${
                                                    isIncoming
                                                        ? "text-emerald-600"
                                                        : "text-orange-600"
                                                }`}
                                            >
                                                {isIncoming ? "+" : "-"}
                                                {movement.quantity}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(
                                                movement.occurred_at
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                                            #{movement.id}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default StockMovementsTable;
