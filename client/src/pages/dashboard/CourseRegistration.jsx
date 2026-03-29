import { useState } from 'react';
import { Save } from 'lucide-react';

// Dummy Course Catalog
const courseCatalog = [
    { id: '1', code: "YZM401", name: "Yazılım Test Mühendisliği", credit: 3, ects: 5, instructor: "Prof. Dr. Ahmet Yılmaz", schedule: [{ day: "Pazartesi", start: "09:00", end: "12:00", room: "D-201" }] },
    { id: '2', code: "YZM403", name: "Kriptografi", credit: 3, ects: 5, instructor: "Doç. Dr. Ayşe Kaya", schedule: [{ day: "Salı", start: "13:00", end: "16:00", room: "D-205" }] },
    { id: '3', code: "YZM405", name: "Bulut Bilişim", credit: 3, ects: 6, instructor: "Dr. Öğr. Üyesi Mehmet Demir", schedule: [{ day: "Çarşamba", start: "10:00", end: "13:00", room: "Lab-1" }] },
    { id: '4', code: "YZM407", name: "Web Servisleri", credit: 3, ects: 5, instructor: "Dr. Öğr. Üyesi Ali Veli", schedule: [{ day: "Pazartesi", start: "10:00", end: "13:00", room: "D-102" }] }, // intentionally conflicting with YZM401
    { id: '5', code: "SEC401", name: "Girişimcilik", credit: 2, ects: 4, instructor: "Öğr. Gör. Zeynep Çelik", schedule: [{ day: "Perşembe", start: "14:00", end: "16:00", room: "Amfi-1" }] },
    { id: '6', code: "SEC403", name: "İş Sağlığı ve Güvenliği", credit: 2, ects: 3, instructor: "Prof. Dr. Hasan Yıldız", schedule: [{ day: "Cuma", start: "09:00", end: "11:00", room: "Amfi-2" }] },
];

export default function CourseRegistration() {
    const [searchTerm, setSearchTerm] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Conflict Detection Engine
    const detectConflicts = (courses) => {
        let newConflicts = [];

        for (let i = 0; i < courses.length; i++) {
            for (let j = i + 1; j < courses.length; j++) {
                const course1 = courses[i];
                const course2 = courses[j];

                course1.schedule.forEach(slot1 => {
                    course2.schedule.forEach(slot2 => {
                        if (slot1.day === slot2.day) {
                            // Convert standard "HH:MM" to minutes for simple comparison
                            const start1 = parseInt(slot1.start.split(':')[0]) * 60 + parseInt(slot1.start.split(':')[1]);
                            const end1 = parseInt(slot1.end.split(':')[0]) * 60 + parseInt(slot1.end.split(':')[1]);
                            const start2 = parseInt(slot2.start.split(':')[0]) * 60 + parseInt(slot2.start.split(':')[1]);
                            const end2 = parseInt(slot2.end.split(':')[0]) * 60 + parseInt(slot2.end.split(':')[1]);

                            // Check overlap (StartA < EndB && StartB < EndA)
                            if (start1 < end2 && start2 < end1) {
                                newConflicts.push({
                                    course1: course1,
                                    course2: course2,
                                    day: slot1.day,
                                    timeOverlap: `${Math.max(start1, start2) / 60}:00 - ${Math.min(end1, end2) / 60}:00`
                                });
                            }
                        }
                    });
                });
            }
        }
        return newConflicts;
    };

    const handleAddCourse = (course) => {
        if (enrolledCourses.find(c => c.id === course.id)) return;

        const newEnrolled = [...enrolledCourses, course];
        setEnrolledCourses(newEnrolled);
        setConflicts(detectConflicts(newEnrolled));
    };

    const handleRemoveCourse = (courseId) => {
        const newEnrolled = enrolledCourses.filter(c => c.id !== courseId);
        setEnrolledCourses(newEnrolled);
        setConflicts(detectConflicts(newEnrolled));
    };

    const handleSave = () => {
        if (conflicts.length > 0) return;
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Dersleriniz başarıyla danışman onayına gönderildi!");
        }, 1500);
    };

    const filteredCatalog = courseCatalog.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credit, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Ders Kayıt Sistemi</h1>
                    <p className="text-slate-500 text-sm">2025-2026 Güz Dönemi Ders Seçimi</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">Kredi Yükü:</span>
                        <span className={`text-lg font-bold ${totalCredits > 18 ? 'text-red-600' : 'text-indigo-600'}`}>{totalCredits}</span>
                        <span className="text-xs text-slate-400">/ 30 AKTS</span>
                    </div>
                    <Button
                        variant="primary"
                        icon={Save}
                        onClick={handleSave}
                        disabled={conflicts.length > 0 || enrolledCourses.length === 0 || isSaving}
                    >
                        {isSaving ? 'Kaydediliyor...' : 'Danışmana Gönder'}
                    </Button>
                </div>
            </div>

            {/* Conflict Warnings */}
            <AnimatePresence>
                {conflicts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 p-2 rounded-full text-red-600 flex-shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-red-800 font-bold mb-2">Ders Programı Çakışması Tespit Edildi!</h3>
                                <p className="text-red-700 text-sm mb-3">
                                    Seçtiğiniz derslerin saatleri birbiriyle çakışıyor. Çakışan derslerle kaydı tamamlayamazsınız. Lütfen programınızı düzenleyin.
                                </p>
                                <div className="space-y-2">
                                    {conflicts.map((conflict, idx) => (
                                        <div key={idx} className="bg-white/60 p-3 rounded-lg flex items-center gap-3 text-sm text-red-900 border border-red-100">
                                            <Badge variant="error" className="shrink-0">{conflict.course1.code}</Badge>
                                            <X size={14} className="text-red-400" />
                                            <Badge variant="error" className="shrink-0">{conflict.course2.code}</Badge>
                                            <span className="ml-2 font-medium flex items-center gap-1">
                                                <CalendarIcon size={14} /> {conflict.day}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Available Courses Catalog */}
                <div className="space-y-4 flex flex-col h-[700px]">
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Ders kodu veya adı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        <Badge variant="outline" className="h-full">Katalog: {filteredCatalog.length}</Badge>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
                        {filteredCatalog.map(course => {
                            const isEnrolled = enrolledCourses.some(c => c.id === course.id);

                            // Check if this specific course conflicts with already enrolled courses
                            const tempConflicts = !isEnrolled ? detectConflicts([...enrolledCourses, course]) : [];
                            const wouldConflict = tempConflicts.length > 0;

                            return (
                                <div
                                    key={course.id}
                                    className={`p-4 rounded-xl border transition-all ${isEnrolled
                                        ? 'bg-slate-50 border-slate-200 opacity-60'
                                        : wouldConflict
                                            ? 'bg-red-50/30 border-red-200 hover:border-red-300'
                                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer group'
                                        }`}
                                    onClick={() => !isEnrolled && handleAddCourse(course)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{course.code}</span>
                                            <h3 className={`font-bold mt-2 ${isEnrolled ? 'text-slate-600' : 'text-slate-800'}`}>{course.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-indigo-600">{course.credit} Kredi</div>
                                            <div className="text-xs text-slate-500">{course.ects} AKTS</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                                        <div className="flex items-center gap-1.5 w-full">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                {course.instructor.charAt(0)}
                                            </div>
                                            <span className="truncate">{course.instructor}</span>
                                        </div>
                                        {course.schedule.map((slot, i) => (
                                            <div key={i} className={`flex items-center gap-3 w-full p-2 rounded-lg ${wouldConflict ? 'bg-red-100 text-red-700' : 'bg-slate-50'}`}>
                                                <span className="flex items-center gap-1 font-medium"><CalendarIcon size={14} /> {slot.day}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {slot.start}-{slot.end}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14} /> {slot.room}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {wouldConflict && !isEnrolled && (
                                        <div className="mt-3 text-xs font-medium text-red-600 flex items-center gap-1">
                                            <AlertTriangle size={12} /> Bu ders programınızla çakışıyor!
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Enrolled Courses / Cart */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-[700px] flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Seçilen Dersler</h2>
                        </div>
                        <Badge variant="primary">{enrolledCourses.length} Ders</Badge>
                    </div>

                    {enrolledCourses.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <BookOpen size={32} className="text-slate-300" />
                            </div>
                            <p>Henüz ders seçilmedi.</p>
                            <p className="text-sm">Sol taraftaki katalogdan ders ekleyebilirsiniz.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                            <AnimatePresence>
                                {enrolledCourses.map(course => {
                                    const isConflicting = conflicts.some(c => c.course1.id === course.id || c.course2.id === course.id);

                                    return (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                            className={`p-4 rounded-xl border relative group ${isConflicting
                                                ? 'bg-red-50 border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-400'
                                                : 'bg-white border-slate-200 shadow-sm'
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleRemoveCourse(course.id)}
                                                className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 border border-slate-200 shadow-sm transition-colors z-10 opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={16} />
                                            </button>

                                            <div className="flex justify-between items-start mb-2 pr-4">
                                                <div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${isConflicting ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {course.code}
                                                    </span>
                                                    <h3 className={`font-bold mt-2 ${isConflicting ? 'text-red-900' : 'text-slate-800'}`}>{course.name}</h3>
                                                </div>
                                                <div className="text-sm font-bold text-slate-600">{course.credit} Kredi</div>
                                            </div>

                                            <div className="mt-3 space-y-1 text-xs">
                                                {course.schedule.map((slot, i) => (
                                                    <div key={i} className={`flex items-center gap-2 p-1.5 rounded ${isConflicting ? 'text-red-800 font-medium bg-red-100/50' : 'text-slate-500 bg-slate-50'}`}>
                                                        <span className="w-20 flex items-center gap-1"><CalendarIcon size={12} /> {slot.day}</span>
                                                        <span className="flex-1 flex items-center gap-1"><Clock size={12} /> {slot.start} - {slot.end}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="bg-indigo-50 rounded-lg p-4 flex justify-between items-center text-sm">
                            <span className="text-indigo-800 font-medium">Toplam AKTS Yükü</span>
                            <span className="text-lg font-bold text-indigo-900">{enrolledCourses.reduce((sum, c) => sum + c.ects, 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
