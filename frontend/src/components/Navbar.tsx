function Navbar() {
    return (
        <nav
            className="flex select-none items-center justify-between
            border-b border-slate-200 bg-white py-4 px-4 sm:px-12 lg:px-25"
        >
            <div className="flex items-center justify-center text-lg font-bold text-slate-900 sm:text-2xl">
                Stock&nbsp;
                <span className="text-blue-600 drop-shadow-[0_0_6px_rgba(37,99,235,0.35)]">
                    Core
                </span>
            </div>
        </nav>
    );
}

export default Navbar;
