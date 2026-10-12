function Footer() {
    const linkClasses =
        "text-slate-500 transition-all duration-300 hover:text-blue-600 hover:drop-shadow-[0_0_6px_rgba(37,99,235,0.4)]";

    return (
        <footer className="border-t border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">

                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-lg font-bold tracking-wide text-slate-900">
                        Stock{" "}
                        <span className="text-blue-600 drop-shadow-[0_0_6px_rgba(37,99,235,0.35)]">
                            Core
                        </span>
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        © {new Date().getFullYear()} All Rights Reserved
                    </p>
                </div>

                <div className="flex gap-6 text-sm">
                    <a
                        href="https://github.com/tvsxar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/poiatsyka/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
