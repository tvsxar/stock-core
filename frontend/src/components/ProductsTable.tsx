import { Search } from "lucide-react";
import { useState } from "react";
import ProductRow from "./ProductRow";
import type { Product } from "../types/products";

type ProductsTableProps = {
  products: Product[];
};

function ProductsTable({ products }: ProductsTableProps) {
    const [search, setSearch] = useState("");
    
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of stock",
        className: "bg-rose-50 text-rose-600 ring-rose-100",
        dot: "bg-rose-500",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low stock",
        className: "bg-amber-50 text-amber-700 ring-amber-100",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In stock",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-500",
    };
  };

  // TODO: search by name and/or sku
  const displayedProducts = products;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.025)]">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Products
            </h2>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {products.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            A complete list of products in your inventory.
          </p>
        </div>

        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {["Product", "SKU", "Stock", "Status", "Action"].map(
                (heading) => (
                  <th
                    key={heading}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                      heading === "Action" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayedProducts.map((product) => {
              const status = getStockStatus(product.stock);

              return (
                <ProductRow product={product} status={status} />
              );
            })}
          </tbody>
        </table>

        {displayedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={25} />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              No products found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Try adjusting your search to find what you're looking for.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {displayedProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {products.length}
          </span>{" "}
          products
        </p>

        <span className="text-xs text-slate-400">
          Inventory overview · Stock Core
        </span>
      </div>
    </section>
  );
}

export default ProductsTable;
