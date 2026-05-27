import { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import Button from '../navigation/Button';

const ListBox = ({ items, selected, onSelect, title }) => (
    <div className="flex flex-col h-64 border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div className="p-3 bg-slate-50 border-b border-slate-200 font-medium text-sm text-slate-700">
            {title} ({items.length})
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
            {items.map((item) => (
                <div
                    key={item.value}
                    onClick={() => onSelect(item.value)}
                    className={`
            px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors
            ${selected.includes(item.value)
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'}
          `}
                >
                    {item.label}
                </div>
            ))}
        </div>
    </div>
);

const TransferList = ({ leftTitle = "Available", rightTitle = "Selected", leftItems = [], rightItems = [], onChange }) => {
    const [leftSelected, setLeftSelected] = useState([]);
    const [rightSelected, setRightSelected] = useState([]);

    const handleSelect = (side, value) => {
        if (side === 'left') {
            setLeftSelected(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
        } else {
            setRightSelected(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
        }
    };

    const moveRight = () => {
        const toMove = leftItems.filter(i => leftSelected.includes(i.value));
        const newLeft = leftItems.filter(i => !leftSelected.includes(i.value));
        const newRight = [...rightItems, ...toMove];

        setLeftSelected([]);
        onChange && onChange(newLeft, newRight);
    };

    const moveLeft = () => {
        const toMove = rightItems.filter(i => rightSelected.includes(i.value));
        const newRight = rightItems.filter(i => !rightSelected.includes(i.value));
        const newLeft = [...leftItems, ...toMove];

        setRightSelected([]);
        onChange && onChange(newLeft, newRight);
    };

    const moveAllRight = () => {
        onChange && onChange([], [...rightItems, ...leftItems]);
    };

    const moveAllLeft = () => {
        onChange && onChange([...leftItems, ...rightItems], []);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <ListBox items={leftItems} selected={leftSelected} onSelect={(v) => handleSelect('left', v)} title={leftTitle} />
            </div>

            <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={moveAllRight} disabled={leftItems.length === 0} icon={ChevronsRight} />
                <Button variant="secondary" size="sm" onClick={moveRight} disabled={leftSelected.length === 0} icon={ChevronRight} />
                <Button variant="secondary" size="sm" onClick={moveLeft} disabled={rightSelected.length === 0} icon={ChevronLeft} />
                <Button variant="secondary" size="sm" onClick={moveAllLeft} disabled={rightItems.length === 0} icon={ChevronsLeft} />
            </div>

            <div className="flex-1">
                <ListBox items={rightItems} selected={rightSelected} onSelect={(v) => handleSelect('right', v)} title={rightTitle} />
            </div>
        </div>
    );
};

export default TransferList;
