
const Separator = ({ orientation = 'horizontal', className = '', ...props }) => {
    return (
        <div
            className={`
        bg-slate-200
        ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'}
        ${className}
      `}
            {...props}
        />
    );
};

export default Separator;
