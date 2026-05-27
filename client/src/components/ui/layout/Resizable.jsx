import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';

const Resizable = ({ direction = 'horizontal', children, initialSize = 50, minSize = 20, maxSize = 80, className = '' }) => {
    const [size, setSize] = useState(initialSize); // Percentage
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const handleUp = () => isDragging.current = false;
        const handleMove = (e) => {
            if (!isDragging.current || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            let newSize;

            if (direction === 'horizontal') {
                const x = e.clientX - rect.left;
                newSize = (x / rect.width) * 100;
            } else {
                const y = e.clientY - rect.top;
                newSize = (y / rect.height) * 100;
            }

            if (newSize >= minSize && newSize <= maxSize) {
                setSize(newSize);
            }
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };
    }, [direction, minSize, maxSize]);

    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length !== 2) return <div className="p-4 border border-red-200 bg-red-50 text-red-600">Error: Resizable requires exactly 2 children.</div>;

    return (
        <div ref={containerRef} className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} w-full h-full ${className}`}>

            {/* First Panel */}
            <div style={{ flex: `0 0 ${size}%` }} className="relative overflow-auto">
                {childrenArray[0]}
            </div>

            {/* Handle */}
            <div
                onMouseDown={() => isDragging.current = true}
                className={`
          flex items-center justify-center bg-slate-100 hover:bg-blue-100 transition-colors z-10
          ${direction === 'horizontal' ? 'w-2 cursor-col-resize border-x border-slate-200' : 'h-2 cursor-row-resize border-y border-slate-200'}
        `}
            >
                {direction === 'horizontal'
                    ? <GripVertical size={12} className="text-slate-400" />
                    : <GripHorizontal size={12} className="text-slate-400" />
                }
            </div>

            {/* Second Panel */}
            <div className="flex-1 overflow-auto">
                {childrenArray[1]}
            </div>

        </div>
    );
};

export default Resizable;
