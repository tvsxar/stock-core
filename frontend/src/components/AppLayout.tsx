import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default AppLayout;
