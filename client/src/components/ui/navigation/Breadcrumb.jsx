
const Breadcrumb = ({ items = [], className = '' }) => {
    return (
        <nav className={`flex items-center text-sm text-slate-500 mb-6 ${className}`}>
            <Link
                to="/dashboard"
                className="flex items-center hover:text-blue-600 transition-colors"
            >
                <Home size={16} />
            </Link>

            {items.map((item, idx) => (
                <div key={idx} className="flex items-center">
                    <ChevronRight size={14} className="mx-2 text-slate-300" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-blue-600 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-800 font-bold">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
