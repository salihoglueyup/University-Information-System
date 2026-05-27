import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowLeft, CheckCircle, FileText, Mail, Phone } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function Student360() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent360 = async () => {
            try {
                const targetId = studentId || '202201025';
                const res = await axiosInstance.get(`/students/${targetId}/360`);
                setStudent(res.data);
            } catch (err) {
                console.error('Error connecting to student API:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent360();
    }, [studentId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-20">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Ogrenci Kaydi Bulunamadi</h2>
                <Button className="mt-4" onClick={() => navigate('/dashboard')}>Panoya Don</Button>
            </div>
        );
    }

    const riskFactors = Array.isArray(student.riskFactors) ? student.riskFactors : [];

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <Button
                variant="ghost"
                size="sm"
                className="w-fit text-gray-500 pl-0 hover:bg-transparent hover:text-gray-800"
                onClick={() => navigate('/dashboard/advisees')}
            >
                <ArrowLeft size={16} className="mr-2" />
                Listeye Don
            </Button>

            <PageHeader
                title="Ogrenci 360"
                description="Akademik ve idari ozet gorunumu"
                icon={FileText}
            />

            <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                        <p className="text-slate-500 mt-1">{student.id} - {student.department}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1"><Mail size={14} /> {student.email}</span>
                            <span className="flex items-center gap-1"><Phone size={14} /> {student.phone}</span>
                        </div>
                    </div>
                    <Badge variant={student.status === 'Active' ? 'success' : 'warning'}>
                        {student.status || 'Bilinmiyor'}
                    </Badge>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        {riskFactors.length > 0 ? <AlertTriangle size={18} className="text-red-600" /> : <CheckCircle size={18} className="text-emerald-600" />}
                        Risk Analizi
                    </h3>
                    {riskFactors.length > 0 ? (
                        <div className="space-y-2">
                            {riskFactors.map((risk, idx) => (
                                <div key={idx} className="p-3 bg-red-50 rounded-lg text-red-700 text-sm flex items-start gap-2">
                                    <Activity size={14} className="mt-0.5" />
                                    <span>{risk}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                            Ogrencide aktif risk unsuru tespit edilmedi.
                        </p>
                    )}
                </Card>

                <Card className="p-6 space-y-3">
                    <h3 className="font-bold text-slate-800">Akademik Ozet</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">GNO</span>
                        <span className="font-semibold">{student.gpa ?? '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Toplam Kredi</span>
                        <span className="font-semibold">{student.totalCredits ?? '-'} / 240</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Danisman</span>
                        <span className="font-semibold">{student.advisor || '-'}</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
import { Badge, Button, Card, PageHeader } from '../../components/ui';
