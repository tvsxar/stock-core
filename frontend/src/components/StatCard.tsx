import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    detail: string;
}

function StatCard({
    label,
    value,
    icon: Icon,
    iconColor,
    iconBg,
    detail,
}: StatCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.055)]">
            <div className="mb-5 flex items-center justify-between">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
                >
                    <Icon
                        size={20}
                        className={iconColor}
                        strokeWidth={1.9}
                    />
                </div>
            </div>

            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>

            <p className="mt-3 text-xs text-slate-400">
                {detail}
            </p>
        </div>
    );
}

export default StatCard;
