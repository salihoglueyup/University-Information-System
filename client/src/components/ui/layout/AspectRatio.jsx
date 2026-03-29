
const AspectRatio = ({ ratio = 16 / 9, children, className = '' }) => {
    return (
        <div className={`relative w-full ${className}`} style={{ paddingBottom: `${(1 / ratio) * 100}%` }}>
            <div className="absolute inset-0">
                {children}
            </div>
        </div>
    );
};

export default AspectRatio;
