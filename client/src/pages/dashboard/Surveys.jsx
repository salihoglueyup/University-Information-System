import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
// Components
import axiosInstance from '../../api/axiosInstance';
export default function Surveys() {
    const [courses, setCourses] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSurveys, setExpandedSurveys] = useState({});

    // Form States
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [isAnonymous, setIsAnonymous] = useState({});
    const [isSubmitting, setIsSubmitting] = useState({});
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [coursesRes, evalRes] = await Promise.all([
                axiosInstance.get('/courses'),
                axiosInstance.get('/evaluations/me')
            ]);

            setCourses(coursesRes.data);
            setEvaluations(evalRes.data);
        } catch (error) {
            console.error('Veriler cekilirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleSurvey = (courseId) => {
        setExpandedSurveys(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));

        // Form init
        if (!ratings[courseId]) {
            setRatings(prev => ({
                ...prev,
                [courseId]: {
                    courseMaterial: 0,
                    teachingEffectiveness: 0,
                    fairGrading: 0,
                    overallSatisfaction: 0
                }
            }));
            setComments(prev => ({ ...prev, [courseId]: '' }));
            setIsAnonymous(prev => ({ ...prev, [courseId]: true }));
        }
    };

    const handleRatingChange = (courseId, key, val) => {
        setRatings(prev => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                [key]: val
            }
        }));
    };

    const handleSubmit = async (course) => {
        const courseRatings = ratings[course._id];

        // Validasyon
        if (Object.values(courseRatings).some(val => val === 0)) {
            setSubmitMessage({ type: 'error', text: 'Lütfen tüm kriterleri puanlayın.' });
            setTimeout(() => setSubmitMessage({ type: '', text: '' }), 3000);
            return;
        }

        setIsSubmitting(prev => ({ ...prev, [course._id]: true }));
        setSubmitMessage({ type: '', text: '' });

        try {
            await axiosInstance.post('/evaluations', {
                course: course._id,
                academicName: course.instructor || 'Atanmadı',
                semester: course.semester || 'Güz 2025',
                ratings: courseRatings,
                comments: comments[course._id],
                isAnonymous: isAnonymous[course._id]
            });

            setSubmitMessage({ type: 'success', text: 'Değerlendirme başarıyla gönderildi. Teşekkür ederiz!' });

            // Başarılı olursa listeyi yenile
            await fetchData();
            setExpandedSurveys(prev => ({ ...prev, [course._id]: false }));

        } catch (error) {
            console.error(error);
            setSubmitMessage({ type: 'error', text: 'Gönderim sırasında bir hata oluştu.' });
        } finally {
            setIsSubmitting(prev => ({ ...prev, [course._id]: false }));
            setTimeout(() => setSubmitMessage({ type: '', text: '' }), 3000);
        }
    };

    // Derived states
    const evaluatedCourseIds = evaluations.map(e => e.course?._id).filter(Boolean);
    const pendingCourses = courses.filter(c => !evaluatedCourseIds.includes(c._id));
    const completedEvaluations = evaluations;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ClipboardList className="text-teal-600 dark:text-teal-400" /> Ders Değerlendirme Formları
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Aldığınız dersler ve öğretim üyeleri için anonim değerlendirmeler</p>
                </div>
            </div>

            {submitMessage.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${submitMessage.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30'}`}
                >
                    <AlertCircle size={20} />
                    <span>{submitMessage.text}</span>
                </motion.div>
            )}

            <div className="grid gap-6">
                {/* AKTİF ANKETLER (BEKLEYEN DERSLER) */}
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">Katılım Bekleyen Anketler ({pendingCourses.length})</h2>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : pendingCourses.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                        <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-emerald-500" />
                        <p>Harika! Bu dönemki tüm derslerinizi değerlendirdiniz.</p>
                    </div>
                ) : (
                    pendingCourses.map((course) => (
                        <Card key={course._id} className="overflow-hidden border-l-4 border-l-teal-500">
                            <div className="flex items-center justify-between p-6">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="info">{course.code}</Badge>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{course.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <Clock size={16} />
                                        <span>Dönem Sonu Değerlendirmesi</span>
                                        <span className="mx-2">•</span>
                                        <span className="font-medium">Eğitmen: {course.instructor || 'Belirtilmemiş'}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleSurvey(course._id)}
                                >
                                    {expandedSurveys[course._id] ? 'Formu Gizle' : 'Ankete Katıl'}
                                    {expandedSurveys[course._id] ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                                </Button>
                            </div>

                            <AnimatePresence>
                                {expandedSurveys[course._id] && ratings[course._id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-6 py-6 space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ders Materyallerinin Kalitesi</span>
                                                    <Rating
                                                        value={ratings[course._id].courseMaterial}
                                                        onChange={(v) => handleRatingChange(course._id, 'courseMaterial', v)}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Öğretim Üyesinin Etkinliği</span>
                                                    <Rating
                                                        value={ratings[course._id].teachingEffectiveness}
                                                        onChange={(v) => handleRatingChange(course._id, 'teachingEffectiveness', v)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Adil Notlandırma Sistemi</span>
                                                    <Rating
                                                        value={ratings[course._id].fairGrading}
                                                        onChange={(v) => handleRatingChange(course._id, 'fairGrading', v)}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Genel Memnuniyet</span>
                                                    <Rating
                                                        value={ratings[course._id].overallSatisfaction}
                                                        onChange={(v) => handleRatingChange(course._id, 'overallSatisfaction', v)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Açık Uçlu Yorumlarınız (Opsiyonel)</label>
                                            <textarea
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                rows="3"
                                                placeholder="Bu ders ve eğitmen hakkındaki düşünceleriniz..."
                                                value={comments[course._id]}
                                                onChange={(e) => setComments(prev => ({ ...prev, [course._id]: e.target.value }))}
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isAnonymous[course._id]}
                                                    onChange={(e) => setIsAnonymous(prev => ({ ...prev, [course._id]: e.target.checked }))}
                                                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Kimliğimi gizli tut (Anonim Gönder)</span>
                                            </label>
                                            <Button
                                                variant="primary"
                                                className="bg-teal-600 hover:bg-teal-700 border-none px-8"
                                                icon={Send}
                                                isLoading={isSubmitting[course._id]}
                                                onClick={() => handleSubmit(course)}
                                            >
                                                Gönder
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))
                )}

                {/* TAMAMLANANLAR */}
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 mt-4">Geçmiş Değerlendirmelerim ({completedEvaluations.length})</h2>

                <div className="grid gap-4 opacity-75">
                    {completedEvaluations.map((evalRecord) => (
                        <Card key={evalRecord._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 shadow-none">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">{evalRecord.course?.title || evalRecord.course?.name || evalRecord.course?.code || "Ders"}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <span>{evalRecord.semester}</span>
                                    <span>•</span>
                                    <span>Eğitmen: {evalRecord.academicName}</span>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
                                <Badge variant="success" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle size={14} className="mr-1" /> Tamamlandı
                                </Badge>
                                <div className="text-xs text-slate-400">
                                    {new Date(evalRecord.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {completedEvaluations.length === 0 && !isLoading && (
                        <div className="text-center text-slate-400 text-sm py-4">Geçmiş değerlendirme bulunmuyor.</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
