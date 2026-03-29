import { deptTasks } from '../../../data/mockData';

const priorityColors = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-blue-50 text-blue-600 border-blue-100'
};

const priorityLabels = {
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük'
};

export default function DepartmentTasksWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Bölüm Görevleri</h2>
                        <p className="text-xs text-gray-400 font-medium">İdari İşler</p>
                    </div>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="space-y-3">
                {deptTasks.map((task) => (
                    <div
                        key={task.id}
                        className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                    >
                        <button className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-purple-600 transition-colors">
                            <CheckSquare size={20} />
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
                                    {task.task}
                                </h3>
                            </div>

                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
                                    {priorityLabels[task.priority]}
                                </span>

                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(task.deadline).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </span>

                                <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {task.assignedBy}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-xs text-gray-500 font-medium">1 Acil Görev</span>
                </div>
                <button className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline">
                    Tümünü Gör
                </button>
            </div>
        </motion.div>
    );
}
