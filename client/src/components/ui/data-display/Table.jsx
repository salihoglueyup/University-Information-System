import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import Checkbox from '../forms/Checkbox';

const Table = ({
    headers = [],
    data = [],
    renderRow,
    emptyMessage = "Kayıt bulunamadı.",
    sortable = false,
    onSort,
    sortedBy, // { key: 'name', direction: 'asc' | 'desc' }
    selectable = false,
    selectedRows = [], // array of IDs
    onRowSelect,
    onSelectAll
}) => {

    const handleSort = (key) => {
        if (!onSort || !key) return;
        const direction = sortedBy?.key === key && sortedBy.direction === 'asc' ? 'desc' : 'asc';
        onSort(key, direction);
    };

    const isAllSelected = data.length > 0 && selectedRows.length === data.length;

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-slate-500 font-bold uppercase text-xs border-b border-gray-200">
                    <tr>
                        {selectable && (
                            <th className="px-6 py-4 w-10">
                                <Checkbox
                                    checked={isAllSelected}
                                    onChange={onSelectAll}
                                />
                            </th>
                        )}
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className={`px-6 py-4 whitespace-nowrap ${header.key && sortable ? 'cursor-pointer hover:bg-gray-100 hover:text-slate-700 transition-colors' : ''}`}
                                onClick={() => header.key && sortable && handleSort(header.key)}
                            >
                                <div className="flex items-center gap-2">
                                    {header.label || header.header || header}
                                    {header.key && sortable && (
                                        <span className="text-slate-400">
                                            {sortedBy?.key === header.key ? (
                                                sortedBy.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                            ) : (
                                                <ChevronsUpDown size={14} />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.length > 0 ? (
                        data.map((item, idx) => {
                            const isSelected = selectedRows.includes(item.id);
                            return (
                                <tr
                                    key={item.id || idx}
                                    className={`
                    transition-colors group
                    ${isSelected ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-blue-50/30'}
                  `}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => onRowSelect(item.id)}
                                            />
                                        </td>
                                    )}
                                    {renderRow ? renderRow(item, idx) : (
                                        headers.map((header, colIdx) => (
                                            <td key={colIdx} className={`px-6 py-4 text-slate-700 ${header.className || ''}`}>
                                                {header.render ? header.render(item[header.accessor], item) : item[header.accessor]}
                                            </td>
                                        ))
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={headers.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center text-slate-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
