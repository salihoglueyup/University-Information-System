import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import {
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { thesisKanbanData } from '../../data/mockData';

// --- Sortable Item Component ---
function SortableItem({ id, item, onClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-amber-100 text-amber-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-move group touch-none"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(item.priority)}`}>
                    {item.priority === 'high' ? 'Yüksek' : item.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                </button>
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1 leading-snug">
                {item.content}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{item.student}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                    {item.student.charAt(0)}
                </div>
            </div>
        </div>
    );
}

// --- Container Component ---
function DroppableContainer({ id, title, count, items, onClickItem }) {
    const { setNodeRef } = useSortable({ id });

    return (
        <div ref={setNodeRef} className="w-80 flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200">
            {/* Column Header */}
            <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-white/50 rounded-t-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${id === 'completed' ? 'bg-green-500' :
                        id === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></span>
                    <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
                    <Badge size="sm" variant="secondary" className="ml-1">
                        {count}
                    </Badge>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Plus size={14} />
                </Button>
            </div>

            {/* Column Items */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                <SortableContext
                    id={id}
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(item => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            onClick={() => onClickItem(item.id)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

export default function ThesisKanban() {
    const navigate = useNavigate();
    const [columns] = useState(thesisKanbanData.columns);
    const [items, setItems] = useState(thesisKanbanData.items);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getColumnItems = (columnId) => items.filter(item => item.column === columnId);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.sortable?.containerId !== 'columns';

        if (!isActiveTask) return;

        // Find the containers
        const activeItem = items.find(i => i.id === activeId);
        const overItem = items.find(i => i.id === overId);

        // Dropping over a column vs dropping over an item
        const activeColumnId = activeItem?.column;
        const overColumnId = overItem ? overItem.column : overId; // if overId is a column key

        if (activeColumnId !== overColumnId) {
            setItems((items) => {
                return items.map(item => {
                    if (item.id === activeId) {
                        return { ...item, column: overColumnId };
                    }
                    return item;
                });
            });

            // Optimistic Backend Update
            axiosInstance.patch(`/thesis-tasks/${activeId}`, { column: overColumnId })
                .catch(() => toast.error('Görev taşınırken sunucu hatası oluştu.'));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeItem = items.find(i => i.id === activeId);
        const overItem = items.find(i => i.id === overId);

        // Reordering within same column
        if (activeItem && overItem && activeItem.column === overItem.column) {
            const oldIndex = items.findIndex(i => i.id === activeId);
            const newIndex = items.findIndex(i => i.id === overId);
            setItems((items) => arrayMove(items, oldIndex, newIndex));

            // Optimistic Backend Sync for ordering
            axiosInstance.patch(`/thesis-tasks/${activeId}/reorder`, { newIndex })
                  .catch(() => console.error('Failed to save task order'));
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard/thesis')}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tez Takip Panosu</h1>
                        <p className="text-sm text-gray-500">Proje aşamalarını sürükle-bırak yöntemiyle yönetin.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter size={18} className="mr-2" />
                        Filtrele
                    </Button>
                    <Button variant="primary">
                        <Plus size={18} className="mr-2" />
                        Yeni Görev
                    </Button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-6 h-full min-w-max">
                        {Object.values(columns).map(column => (
                            <DroppableContainer
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                count={getColumnItems(column.id).length}
                                items={getColumnItems(column.id)}
                                onClickItem={() => navigate(`/dashboard/milestone-tracker/1`)} // Using mock id 1 for demo
                            />
                        ))}
                    </div>
                </div>
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <SortableItem
                            id={activeId}
                            item={items.find(i => i.id === activeId)}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
import { ArrowLeft, Calendar, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { Badge, Button } from '../../components/ui';
