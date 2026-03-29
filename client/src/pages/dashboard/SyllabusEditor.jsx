import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '../../hooks/queries/useCourseDetail';
import { toast } from 'react-hot-toast';

export default function SyllabusEditor() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [editedSyllabus, setEditedSyllabus] = useState(null);
    const defaultSyllabus = {
        description: '',
        weeks: [],
        assessmentMethods: []
    };
    const { data, isLoading: loading } = useCourseDetail(courseId);
    const syllabus = editedSyllabus || data?.syllabus || defaultSyllabus;

    const handleSave = () => {
        // In a real app, this would send a POST/PUT request
        toast.success("Ders izlencesi kaydedildi!");
        // Simulate save delay
        setTimeout(() => navigate(`/dashboard/course/${courseId}`), 500);
    };

    const addWeek = () => {
        setEditedSyllabus({
            ...syllabus,
            weeks: [
                ...syllabus.weeks,
                { week: syllabus.weeks.length + 1, topic: '', outcomes: '', materials: '' }
            ]
        });
    };

    const removeWeek = (index) => {
        const newWeeks = syllabus.weeks.filter((_, i) => i !== index).map((w, i) => ({ ...w, week: i + 1 }));
        setEditedSyllabus({ ...syllabus, weeks: newWeeks });
    };

    const updateWeek = (index, field, value) => {
        const newWeeks = [...syllabus.weeks];
        newWeeks[index] = { ...newWeeks[index], [field]: value };
        setEditedSyllabus({ ...syllabus, weeks: newWeeks });
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(`/dashboard/course/${courseId}`)}>
                    <ArrowLeft size={18} className="mr-2" />
                    Ders Detayına Dön
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline">İptal</Button>
                    <Button variant="primary" onClick={handleSave}>
                        <Save size={18} className="mr-2" />
                        Kaydet
                    </Button>
                </div>
            </div>

            <PageHeader
                title={`${courseId} - Ders İzlencesi Düzenle`}
                description="Dersin haftalık planını ve değerlendirme kriterlerini düzenleyin."
            />

            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Genel Bilgiler</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ders Tanımı</label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={syllabus.description || ''}
                            onChange={(e) => setEditedSyllabus({ ...syllabus, description: e.target.value })}
                            placeholder="Dersin genel amacını ve içeriğini açıklayınız..."
                        />
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Haftalık Plan</h3>
                    <Button size="sm" onClick={addWeek}>
                        <Plus size={16} className="mr-2" />
                        Hafta Ekle
                    </Button>
                </div>

                {syllabus.weeks.map((week, idx) => (
                    <Card key={idx} className="p-4 relative hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2 pt-2 text-gray-400 cursor-move">
                                <GripVertical size={20} />
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                    {week.week}
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Konu Başlığı"
                                    value={week.topic}
                                    onChange={(e) => updateWeek(idx, 'topic', e.target.value)}
                                    placeholder="Örn: Yazılım Mühendisliğine Giriş"
                                />
                                <Input
                                    label="Ders Materyalleri / Kaynaklar"
                                    value={week.materials}
                                    onChange={(e) => updateWeek(idx, 'materials', e.target.value)}
                                    placeholder="Örn: Bölüm 1, Slide Set 1"
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Öğrenim Çıktısı (Kazanım)"
                                        value={week.outcomes}
                                        onChange={(e) => updateWeek(idx, 'outcomes', e.target.value)}
                                        placeholder="Bu hafta sonunda öğrenci neler yapabilecek?"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600" onClick={() => removeWeek(idx)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Değerlendirme Sistemi</h3>
                <p className="text-gray-500 mb-4 text-sm">Not ağırlıklarının toplamı 100 olmalıdır.</p>

                <div className="space-y-3">
                    {syllabus.assessmentMethods && syllabus.assessmentMethods.map((method, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <Input
                                className="flex-1"
                                value={method.type}
                                readOnly
                            />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    className="w-24 text-center"
                                    value={method.weight}
                                    onChange={(e) => {
                                        const newMethods = [...syllabus.assessmentMethods];
                                        newMethods[idx].weight = parseInt(e.target.value) || 0;
                                        setEditedSyllabus({ ...syllabus, assessmentMethods: newMethods });
                                    }}
                                />
                                <span className="text-gray-500 font-medium">%</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-4 border-t mt-4">
                        <div className="text-lg font-bold">
                            Toplam: <span className={syllabus.assessmentMethods?.reduce((a, b) => a + b.weight, 0) === 100 ? 'text-green-600' : 'text-red-600'}>
                                {syllabus.assessmentMethods?.reduce((a, b) => a + b.weight, 0)}%
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
