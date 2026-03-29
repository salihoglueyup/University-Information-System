import { useState } from 'react';
import {
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortableItem = ({ id, content }) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-2 cursor-grab active:cursor-grabbing group
        hover:border-blue-300 hover:shadow-md transition-all
      `}
        >
            <div className="flex items-start gap-2">
                <div className="mt-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={14} />
                </div>
                <div className="text-sm text-slate-700 font-medium">
                    {content}
                </div>
            </div>
        </div>
    );
};

// Container Component (Column)
const Container = ({ id, items, title, className }) => {
    const { setNodeRef } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`bg-slate-50 rounded-xl p-4 w-72 flex-shrink-0 flex flex-col max-h-full ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
                <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-bold">{items.length}</span>
            </div>

            <SortableContext
                id={id}
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 overflow-y-auto min-h-[100px]">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id} content={item.content} />
                    ))}
                </div>
            </SortableContext>

            <button className="mt-2 w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-slate-400">
                <Plus size={16} />
                Ekle
            </button>
        </div>
    );
};

const KanbanBoard = ({ initialData, className = '' }) => {
    // initialData structure: { 'todo': [{id: '1', content: 'Task 1'}], 'doing': [], 'done': [] }
    const [items, setItems] = useState(initialData || {
        todo: [
            { id: '1', content: 'Ders kayıtlarını tamamla' },
            { id: '2', content: 'Danışman onayı al' },
        ],
        inProgress: [
            { id: '3', content: 'Vize sınavlarına çalış' },
        ],
        done: [
            { id: '4', content: 'Harç ödemesini yap' },
        ]
    });

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id) => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            setActiveId(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
            const overIndex = items[overContainer].findIndex((item) => item.id === overId);

            if (activeIndex !== overIndex) {
                setItems((items) => ({
                    ...items,
                    [activeContainer]: arrayMove(items[activeContainer], activeIndex, overIndex),
                }));
            }
        }

        setActiveId(null);
    };

    // Titles mapping (simple for demo)
    const titles = {
        todo: 'Yapılacaklar',
        inProgress: 'Devam Edenler',
        done: 'Tamamlananlar'
    };

    return (
        <div className={`overflow-x-auto ${className}`}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 pb-4 min-w-max h-full items-start">
                    <SortableContext items={Object.keys(items)}>
                        {Object.keys(items).map((containerId) => (
                            <Container
                                key={containerId}
                                id={containerId}
                                title={titles[containerId] || containerId}
                                items={items[containerId]}
                            />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay>
                    {activeId ? <SortableItem id={activeId} content="Item" /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
