import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<div>404 Not Found</div>} />

                <Route path="/" element={<Navigate to="/products" replace />} />

                <Route path="/products" element={<div>Products List</div>} />

                <Route path="/products/:id" element={<div>Product Detail</div>} />
            </Routes>
        </Router>
    )
}

export default AppRouter;
