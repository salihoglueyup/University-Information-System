
const Skeleton = ({ width, height, className = '', ...props }) => {
    return (
        <div
            className={`bg-slate-200 animate-pulse rounded-md ${className}`}
            style={{ width, height }}
            {...props}
        />
    );
};

export default Skeleton;
