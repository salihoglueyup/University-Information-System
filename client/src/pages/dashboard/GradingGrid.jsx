import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '../../hooks/queries/useCourseDetail';
import { toast } from 'react-toastify';

export default function GradingGrid() {
    const { courseId, assessmentId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: loading } = useCourseDetail(courseId);
    const [gradeEditsByKey, setGradeEditsByKey] = useState({});

    const assessmentKey = `${courseId}:${assessmentId}`;
    const currentEdits = useMemo(() => gradeEditsByKey[assessmentKey] || {}, [gradeEditsByKey, assessmentKey]);

    const baseStudents = useMemo(() => {
        const roster = data?.students || [];
        return roster.map(s => ({
            ...s,
            currentGrade: s[assessmentId] || ''
        }));
    }, [data, assessmentId]);

    const students = useMemo(() => {
        return baseStudents.map(student => {
            if (Object.prototype.hasOwnProperty.call(currentEdits, student.id)) {
                return { ...student, currentGrade: currentEdits[student.id] };
            }
            return student;
        });
    }, [baseStudents, currentEdits]);

    const stats = useMemo(() => {
        const grades = students
            .map(s => s.currentGrade)
            .filter(currentGrade => currentGrade !== '' && currentGrade !== null && currentGrade !== undefined)
            .map(currentGrade => parseFloat(currentGrade))
            .filter(g => !isNaN(g));

        if (grades.length === 0) {
            return { average: 0, max: 0, min: 0, submitted: 0 };
        }

        const sum = grades.reduce((a, b) => a + b, 0);
        return {
            average: (sum / grades.length).toFixed(1),
            max: Math.max(...grades),
            min: Math.min(...grades),
            submitted: grades.length
        };
    }, [students]);

    const courseName = data?.name || '';

    const handleGradeChange = (studentId, value) => {
        // Validation: 0-100
        let val = value;
        if (val > 100) val = 100;
        if (val < 0) val = 0;

        setGradeEditsByKey(prev => {
            const existing = prev[assessmentKey] || {};
            return {
                ...prev,
                [assessmentKey]: {
                    ...existing,
                    [studentId]: val
                }
            };
        });
    };

    const handleSave = () => {
        toast.success("Notlar kaydedildi!");
        // Simulate sending data back
        // TODO: implement save grades
    };

    const getGradeColor = (grade) => {
        if (!grade && grade !== 0) return 'bg-white';
        if (grade >= 90) return 'bg-green-50 text-green-700 font-bold';
        if (grade >= 70) return 'bg-blue-50 text-blue-700 font-bold';
        if (grade >= 50) return 'bg-yellow-50 text-yellow-700 font-bold';
        return 'bg-red-50 text-red-700 font-bold';
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit text-gray-500 pl-0 hover:bg-transparent hover:text-gray-800"
                    onClick={() => navigate(`/dashboard/course/${courseId}`)}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Ders Detayına Dön
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{courseId} - Not Girişi</h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <span className="font-semibold text-blue-600 uppercase">{assessmentId}</span>
                            <span>•</span>
                            <span>{courseName}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Download size={18} className="mr-2" />
                            Excel İndir
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            <Save size={18} className="mr-2" />
                            Kaydet
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ortalama</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.average}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <ArrowLeft size={24} className="rotate-90" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En Yüksek</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.max}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <ArrowLeft size={24} className="-rotate-90" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En Düşük</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.min}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Filter size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Giriş Yapılan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.submitted} / {students.length}</p>
                    </div>
                </Card>
            </div>

            {/* Grading Table */}
            <Card className="overflow-visible">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center rounded-t-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Öğrenci Ara..."
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">Sadece Eksikleri Göster</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Öğrenci No</th>
                                <th className="px-6 py-3">Ad Soyad</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3 text-right">Not (0-100)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.id}</td>
                                    <td className="px-6 py-4">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={student.status === 'Enrolled' ? 'success' : 'warning'}>
                                            {student.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className={`w-20 px-3 py-2 border rounded-lg text-center font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getGradeColor(student.currentGrade)}`}
                                            placeholder="-"
                                            value={student.currentGrade}
                                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
import { ArrowLeft, BarChart2, Download, Filter, Save, Search } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';
