import {
    Box,
    CircleAlert,
    Package,
    PackagePlus,
} from "lucide-react";
import StatCard from "./StatCard";
import type { Product } from "../types/products";

interface StatisticsProps {
    products: Product[];
}

function Statistics({ products }: StatisticsProps) {
    const totalProducts = products.length;

    const totalUnits = products.reduce(
        (sum, product) => sum + product.stock,
        0
    );

    const lowStockProducts = products.filter(
        (product) => product.stock > 0 && product.stock <= 10
    ).length;

    const outOfStockProducts = products.filter(
        (product) => product.stock === 0
    ).length;

    const stats = [
        {
            label: "Total products",
            value: totalProducts,
            icon: Package,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
            detail: "Products in your catalog",
        },
        {
            label: "Total units",
            value: totalUnits.toLocaleString(),
            icon: Box,
            iconColor: "text-violet-600",
            iconBg: "bg-violet-50",
            detail: "Units across all products",
        },
        {
            label: "Low stock",
            value: lowStockProducts,
            icon: CircleAlert,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50",
            detail: "10 units or fewer",
        },
        {
            label: "Out of stock",
            value: outOfStockProducts,
            icon: PackagePlus,
            iconColor: "text-rose-600",
            iconBg: "bg-rose-50",
            detail: "Products needing restock",
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    );
}

export default Statistics;
