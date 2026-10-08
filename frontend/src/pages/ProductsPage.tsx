import { useState } from "react";
import ProductsHeader from "../components/ProductsHeader";
import Statistics from "../components/Statistics";
import AddProductModal from "../components/AddProductModal";
import ProductsTable from "../components/ProductsTable";
import type { Product } from "../types/products";

const initialProducts: Product[] = [
  { id: 1, sku: "KB-001", name: "Mechanical Keyboard", stock: 124 },
  { id: 2, sku: "MS-002", name: "Wireless Mouse", stock: 86 },
  { id: 3, sku: "MN-003", name: "UltraWide Monitor 34”", stock: 12 },
  { id: 4, sku: "HD-004", name: "USB-C Hub 7-in-1", stock: 0 },
  { id: 5, sku: "HP-005", name: "Studio Headphones", stock: 43 },
  { id: 6, sku: "WC-006", name: "4K Webcam Pro", stock: 8 },
  { id: 7, sku: "LP-007", name: "Laptop Stand", stock: 67 },
  { id: 8, sku: "CH-008", name: "Ergonomic Office Chair", stock: 5 },
];

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

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
          products={products}
          setProducts={setProducts}
          closeModal={closeModal}
        />
      )}
    </main>
  );
}

export default ProductsPage;
