import { useState, useMemo, useEffect } from 'react';
import { AlertCircle, BookOpen, CalendarIcon, CheckCircle, ChevronRight, Clock, FileText, LayoutGrid, ListIcon, Search, Upload } from 'lucide-react';

// Components
import AssignmentSubmissionModal from '../../components/dashboard/assignments/AssignmentSubmissionModal';

import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/authStorage';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tümü');
    const [courseFilter, setCourseFilter] = useState('Tümü');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const storedUser = getUser() || {};
                const userId = storedUser.id || storedUser._id;

                const res = await axiosInstance.get('/assignments');
                const responseJson = res.data;
                const dataArray = responseJson.data || responseJson;
                const userAssignments = dataArray.filter(a => a.userId === userId || a.userId === 'all' || !a.userId || a.userId === userId?.toString());
                setAssignments(userAssignments.length > 0 ? userAssignments : dataArray);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Derived Data
    const filteredAssignments = useMemo(() => {
        return assignments.filter(assignment => {
            const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'Tümü' || assignment.status === statusFilter;
            const matchesCourse = courseFilter === 'Tümü' || assignment.course === courseFilter;
            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [searchQuery, statusFilter, courseFilter, assignments]);

    // Stats
    const stats = useMemo(() => {
        const completed = assignments.filter(a => a.status === 'Tamamlandı').length;
        const pending = assignments.filter(a => a.status === 'Bekliyor' || a.status === 'Yeni').length;
        const late = assignments.filter(a => a.status === 'Gecikti').length;
        const averageGrade = 85; // Mock calculation, real implementation depends on gradesAPI

        return [
            { label: 'Bekleyen Ödevler', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Tamamlanan', value: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Geciken', value: late, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
            { label: 'Ortalama Başarı', value: `%${averageGrade}`, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ];
    }, [assignments]);

    // Unique Courses for Filter
    const courses = ['Tümü', ...new Set(assignments.map(a => a.course))];
    const statuses = ['Tümü', 'Bekliyor', 'Yeni', 'Devam Ediyor', 'Tamamlandı', 'Gecikti'];

    const handleOpenModal = (assignment) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAssignment(null);
    };

    // Columns
    const columns = [
        {
            header: 'Ders',
            accessor: 'course',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen size={16} />
                    </div>
                    <span className="font-medium text-slate-700">{course}</span>
                </div>
            )
        },
        { header: 'Ödev Başlığı', accessor: 'title', sortable: true, className: 'font-medium text-slate-900' },
        {
            header: 'Son Teslim',
            accessor: 'dueDate',
            sortable: true,
            render: (date) => (
                <div className="flex items-center gap-2 text-slate-600 text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                    <CalendarIcon size={12} />
                    <span>{date}</span>
                </div>
            )
        },
        {
            header: 'Durum',
            accessor: 'status',
            sortable: true,
            render: (status) => {
                const variants = {
                    'Bekliyor': 'warning',
                    'Devam Ediyor': 'info',
                    'Yeni': 'info',
                    'Tamamlandı': 'success',
                    'Gecikti': 'danger'
                };
                return <Badge variant={variants[status] || 'secondary'} className="px-3">{status}</Badge>;
            }
        },
        {
            header: 'İlerlem',
            accessor: 'id', // Dummy accessor
            render: (_, row) => (
                <div className="w-24">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${row.status === 'Tamamlandı' ? 'bg-emerald-500' : (row.status === 'Devam Ediyor' || row.status === 'Yeni') ? 'bg-blue-500' : 'bg-slate-300'}`}
                            style={{ width: row.status === 'Tamamlandı' ? '100%' : (row.status === 'Devam Ediyor' || row.status === 'Yeni') ? '50%' : '10%' }}
                        ></div>
                    </div>
                </div>
            )
        },
        {
            header: '',
            accessor: 'actions',
            render: (_, row) => (
                <Button
                    variant={row.status === 'Tamamlandı' ? 'secondary' : 'primary'}
                    size="sm"
                    icon={row.status === 'Tamamlandı' ? FileText : Upload}
                    onClick={() => handleOpenModal(row)}
                >
                    {row.status === 'Tamamlandı' ? 'İncele' : 'Yükle'}
                </Button>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header Section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Ödevlerim</h1>
                    <p className="text-slate-500 text-sm mt-1">Dönem içi ödev ve proje takiplerinizi buradan yapabilirsiniz.</p>
                </div>
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${stat.bg} ${stat.border} border border-opacity-50`}>
                            <div className={`p-1.5 rounded-full bg-white/80 ${stat.color}`}>
                                <stat.icon size={14} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold opacity-70">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Ödev veya ders ara..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                            >
                                {courses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card className="overflow-hidden border-0 shadow-lg">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <DataGrid
                                    columns={columns}
                                    data={filteredAssignments}
                                    pageSize={10}
                                    emptyMessage="Aradığınız kriterlere uygun ödev bulunamadı."
                                />
                            )}
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="board"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : ['Yeni', 'Devam Ediyor', 'Tamamlandı'].map((status) => (
                                <div key={status} className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${status === 'Yeni' || status === 'Bekliyor' ? 'bg-amber-500' : status === 'Devam Ediyor' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                            {status}
                                        </h3>
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {filteredAssignments.filter(a => a.status === status).length}
                                        </span>
                                    </div>

                                    <motion.div
                                        className="space-y-3"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: { staggerChildren: 0.1 }
                                            }
                                        }}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {filteredAssignments.filter(a => a.status === status).map((assignment) => (
                                            <motion.div
                                                key={assignment.id}
                                                layoutId={assignment.id}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                                className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                                                onClick={() => handleOpenModal(assignment)}
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent group-hover:via-blue-400 transition-colors"></div>
                                                <div className="flex justify-between items-start mb-2 pl-3">
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-100">{assignment.course}</Badge>
                                                    {status === 'Gecikti' && <AlertCircle size={16} className="text-red-500" />}
                                                </div>
                                                <h4 className="font-bold text-slate-800 mb-1 pl-3 group-hover:text-blue-600 transition-colors">{assignment.title}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2 pl-3 mb-3">{assignment.description}</p>

                                                <div className="flex items-center justify-between pl-3 pt-3 border-t border-slate-50">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                                        <Clock size={12} />
                                                        {assignment.dueDate}
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submission Modal */}
            <AssignmentSubmissionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                assignment={selectedAssignment}
            />
        </motion.div>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Card, DataGrid } from '../../components/ui';
