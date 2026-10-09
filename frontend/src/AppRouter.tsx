import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<div>404 Not Found</div>} />

                <Route path="/" element={<Navigate to="/products" replace />} />

                <Route path="/products" element={<ProductsPage />} />

                <Route path="/products/:id" element={<ProductDetailsPage />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;
