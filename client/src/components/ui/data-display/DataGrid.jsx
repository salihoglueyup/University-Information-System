import { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '../forms/Input';
import Button from '../navigation/Button';

const DataGrid = ({ columns = [], data = [], pageSize = 10, className = '' }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Sorting logic
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // Filtering logic (Simple global search)
    const filteredData = useMemo(() => {
        return sortedData.filter(item => {
            return Object.values(item).some(val =>
                String(val).toLowerCase().includes(filterText.toLowerCase())
            );
        });
    }, [sortedData, filterText]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
            {/* Header Controls */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <div className="relative w-full sm:w-72">
                    <Input
                        placeholder="Tabloda ara..."
                        icon={Search}
                        value={filterText}
                        onChange={(e) => { setFilterText(e.target.value); setCurrentPage(1); }}
                        className="bg-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Filter}>Filtrele</Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                        <tr>
                            {columns.map((col, index) => {
                                const columnKey = col.key || col.accessor || index;
                                return (
                                    <th
                                        key={columnKey}
                                        className={`px-6 py-4 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
                                        onClick={() => col.sortable && requestSort(columnKey)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.header} {/* Changed from col.label to col.header to match usage in Assignments.jsx, or keep label if standard */}
                                            {col.sortable && (
                                                <span className="text-slate-400">
                                                    {sortConfig?.key === columnKey ? (
                                                        sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                    ) : (
                                                        <div className="flex flex-col"><ChevronUp size={10} className="-mb-1" /><ChevronDown size={10} /></div>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentData.length > 0 ? (
                            currentData.map((row, idx) => (
                                <tr key={row.id || idx} className="hover:bg-blue-50/30 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-slate-700">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                                    Kayıt bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                <span className="text-sm text-slate-500">
                    Toplam <b>{filteredData.length}</b> kayıttan <b>{(currentPage - 1) * pageSize + 1}</b> - <b>{Math.min(currentPage * pageSize, filteredData.length)}</b> arası gösteriliyor
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={ChevronLeft}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Simple logic to show a window of pages could be added here
                        // For now showing first 5 or logic from Pagination component
                        let p = i + 1;
                        // Adjust to show current page in middle if possible
                        if (totalPages > 5 && currentPage > 3) {
                            p = currentPage - 2 + i;
                            if (p > totalPages) p = i + 1 + (totalPages - 5);
                        }

                        if (p <= totalPages) return (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white text-slate-600'}`}
                            >
                                {p}
                            </button>
                        )
                        return null;
                    })}
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={ChevronRight}
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
