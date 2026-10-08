import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/products";

import ProductsHeader from "../components/ProductsHeader";
import Statistics from "../components/Statistics";
import AddProductModal from "../components/AddProductModal";
import ProductsTable from "../components/ProductsTable";

import type { Product } from "../types/products";

function ProductsPage() {
  const { data: products, isPending, isError, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
        <div className="text-lg font-semibold text-slate-700">Loading products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
        <div className="text-lg font-semibold text-red-600">
          Error: {(error as Error).message}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <ProductsHeader setIsAddModalOpen={setIsAddModalOpen} />

        <Statistics products={products} />

        <ProductsTable
          products={products}
        />

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Inventory dashboard
          <span className="text-slate-300">·</span>
          Manage and monitor your stock in one place.
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal
          closeModal={closeModal}
        />
      )}
    </main>
  );
}

export default ProductsPage;
