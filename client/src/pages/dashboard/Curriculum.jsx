import { useState } from 'react';
import { courseCatalog } from '../../data/mockData';

export default function Curriculum() {
    const [courses, setCourses] = useState(courseCatalog); // Mock state

    const handleEdit = (course) => {
        console.log("Edit course:", course);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bu dersi silmek istediğinize emin misiniz?")) {
            console.log("Delete course:", id);
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <BookOpen size={24} />
                        </div>
                        Müfredat Yönetimi
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Ders kataloğu, kredi ve AKTS bilgilerini düzenleyin.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">
                        <Plus size={18} />
                        Yeni Ders
                    </button>
                </div>
            </div>

            {/* Content */}
            <CourseList
                courses={courses}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </motion.div>
    );
}
