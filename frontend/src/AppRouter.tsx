import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AppLayout from "./components/AppLayout";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRouter;