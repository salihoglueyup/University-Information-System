
const ScrollArea = ({ children, className = '', height = 'h-full', ...props }) => {
    return (
        <div
            className={`
        overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300
        ${height} ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default ScrollArea;
