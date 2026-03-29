import { useState } from 'react';

// Mock Data
import { socialTranscript, socialTranscriptCategories, socialTranscriptExtraPoints } from '../../data/mockData';

export default function SocialTranscript() {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const toggleCategory = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    const handleUploadClick = (e, task) => {
        e.stopPropagation();
        setSelectedTask(task);
        setUploadModalOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate total earned points
    const earnedPointsInitial = socialTranscriptCategories.reduce((acc, cat) => {
        return acc + cat.items.reduce((sum, item) => sum + (item.completed ? item.points : 0), 0);
    }, 0);

    const extraPointsTotal = socialTranscriptExtraPoints.reduce((acc, item) => acc + item.points, 0);
    const totalEarnedPoints = earnedPointsInitial + extraPointsTotal;

    const isSuccessful = totalEarnedPoints >= socialTranscript.requiredPoints;

    // Prepare Radar Chart Data
    const radarData = socialTranscriptCategories.map(cat => ({
        subject: cat.title.split(' ')[0], // Take first word for label brevity
        A: cat.items.reduce((sum, item) => sum + (item.completed ? item.points : 0), 0),
        fullMark: cat.items.reduce((sum, item) => sum + item.maxPoints, 0),
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 print:space-y-4"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Award className="text-indigo-600" /> Sosyal Karne
                    </h1>
                    <p className="text-slate-500 text-sm">Akademik, Sosyal-Kültürel, Spor ve Profesyonel Gelişim</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint} className="flex gap-2">
                        <Download size={16} /> <span className="hidden sm:inline">PDF İndir</span>
                    </Button>
                </div>
            </div>

            {/* Print Header (Visible only in print) */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">İstanbul Aydın Üniversitesi</h1>
                <h2 className="text-xl text-slate-600">Sosyal Karne Transkripti</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Score Summary Card */}
                <Card className="lg:col-span-2 p-0 overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white print:break-inside-avoid">
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Award size={300} />
                        </div>

                        <div className="z-10 text-center md:text-left">
                            <h2 className="text-5xl font-bold mb-2 tracking-tight">{totalEarnedPoints} <span className="text-2xl text-indigo-200 font-normal">Puan</span></h2>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <Badge variant={isSuccessful ? "success" : "warning"} className="text-sm px-3 py-1">
                                    {isSuccessful ? "BAŞARILI" : "DEVAM EDİYOR"}
                                </Badge>
                                <span className="text-indigo-200 text-sm">Gerekli: {socialTranscript.requiredPoints} Puan</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg z-10">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                                <span>İlerleme</span>
                                <span>{Math.min(100, Math.round((totalEarnedPoints / socialTranscript.requiredPoints) * 100))}%</span>
                            </div>
                            <div className="w-full bg-indigo-950/50 rounded-full h-4 overflow-hidden border border-white/10 print:border-slate-300">
                                <div
                                    className={`h-full ${isSuccessful ? 'bg-emerald-400' : 'bg-amber-400'} print:bg-slate-800`}
                                    style={{ width: `${Math.min(100, (totalEarnedPoints / socialTranscript.requiredPoints) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-center md:text-right mt-2 text-indigo-300 print:text-indigo-100">
                                {isSuccessful
                                    ? "Tebrikler! Sosyal karne başarı hedefini tamamladınız."
                                    : `Başarı için ${socialTranscript.requiredPoints - totalEarnedPoints} puan daha gerekli.`}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Radar Chart Card */}
                <Card className="p-4 flex flex-col items-center justify-center min-h-[300px] print:break-inside-avoid">
                    <h3 className="font-bold text-slate-700 mb-2 self-start flex items-center gap-2">
                        <Hexagon size={18} className="text-indigo-500" /> Yetkinlik Haritası
                    </h3>
                    <div className="w-full h-[250px] -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Puan"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fill="#8b5cf6"
                                    fillOpacity={0.4}
                                />
                                <RechartsTooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Badge Showcase */}
            <Card className="p-6 print:break-inside-avoid">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <Award className="text-amber-500" /> Rozetlerim
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {socialTranscript.badges.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                <Star size={32} fill="currentColor" className="text-amber-500" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs">{badge.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
                        </div>
                    ))}
                    {/* Placeholder for future badges */}
                    {[1, 2, 3].map((i) => (
                        <div key={`locked-${i}`} className="flex flex-col items-center text-center p-4 border border-dashed border-slate-200 rounded-xl opacity-50 grayscale">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                                <Award size={32} />
                            </div>
                            <h4 className="font-bold text-slate-400 text-xs">Kilitli</h4>
                            <p className="text-[10px] text-slate-400 mt-1">???</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Categories Accordion */}
            <div className="grid gap-4 print:block print:space-y-4">
                {socialTranscriptCategories.map((category) => (
                    <Card key={category.id} className="overflow-hidden transition-shadow hover:shadow-md print:shadow-none print:border-slate-300 print:break-inside-avoid">
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left print:p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm print:hidden
                                    ${category.id === 1 ? 'bg-blue-500' : ''}
                                    ${category.id === 2 ? 'bg-purple-500' : ''}
                                    ${category.id === 3 ? 'bg-rose-500' : ''}
                                    ${category.id === 4 ? 'bg-emerald-500' : ''}
                                    ${category.id === 5 ? 'bg-amber-500' : ''}
                                    ${category.id === 6 ? 'bg-cyan-500' : ''}
                                `}>
                                    {category.id}
                                </div>
                                <div className="print:flex print:items-center print:gap-2">
                                    <h3 className="font-bold text-slate-800 text-lg">{category.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5 print:hidden">
                                        {category.items.filter(i => i.completed).length} tamamlanan etkinlik
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block print:block">
                                    <span className="block font-bold text-slate-700">
                                        {category.items.reduce((sum, item) => sum + (item.completed ? item.points : 0), 0)} Puan
                                    </span>
                                </div>
                                {expandedCategory === category.id ? <ChevronUp className="text-slate-400 print:hidden" /> : <ChevronDown className="text-slate-400 print:hidden" />}
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {(expandedCategory === category.id || window.matchMedia('print').matches) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 print:block print:h-auto print:opacity-100"
                                >
                                    <div className="p-4 bg-slate-50/50 space-y-2 print:bg-white print:p-2">
                                        {category.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 rounded-xl border flex gap-4 items-start transition-all print:border-0 print:p-2 print:border-b print:rounded-none
                                                    ${item.completed
                                                        ? 'bg-emerald-50 border-emerald-100 shadow-sm print:bg-white'
                                                        : 'bg-white border-slate-100 opacity-80 hover:opacity-100 print:hidden'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 print:border-black print:text-black
                                                    ${item.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'}
                                                `}>
                                                    <CheckCircle2 size={14} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <span className={`text-sm font-medium ${item.completed ? 'text-emerald-900 print:text-black' : 'text-slate-700'}`}>
                                                            {item.description}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs font-bold whitespace-nowrap px-2 py-1 rounded-md print:border print:border-slate-300
                                                                ${item.completed ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'}
                                                            `}>
                                                                {item.points} / {item.maxPoints} Puan
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {item.completed && (
                                                        <div className="mt-2 flex items-center justify-between gap-1 text-xs text-emerald-600 font-medium print:hidden">
                                                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Onaylı Başvuru</span>
                                                        </div>
                                                    )}
                                                    {!item.completed && (
                                                        <div className="mt-2 flex justify-end print:hidden">
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                className="flex items-center gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                                onClick={(e) => handleUploadClick(e, item)}
                                                            >
                                                                <Upload size={12} /> Kanıt Yükle
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}
            </div>

            {/* Extra Points Table */}
            <Card className="p-6 print:break-inside-avoid">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <Star className="text-amber-500" /> Ek Puan Listesi
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 print:border-slate-300">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs print:bg-slate-100 print:text-black">
                            <tr>
                                <th className="px-6 py-4">Eklenen Kategori</th>
                                <th className="px-6 py-4">Ekleyen Kişi</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">Ek Puan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                            {socialTranscriptExtraPoints.map((extra) => (
                                <tr key={extra.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{extra.category}</td>
                                    <td className="px-6 py-4 text-slate-500">{extra.officer}</td>
                                    <td className="px-6 py-4 text-slate-500">{extra.date}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">+{extra.points}</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50/50 print:bg-white">
                                <td colSpan="3" className="px-6 py-4 font-bold text-right text-slate-600">Toplam Ek Puan</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800 text-lg">{extraPointsTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Evidence Upload Modal */}
            <Modal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                title="Etkinlik Kanıtı Yükle"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-800">
                        <Info className="shrink-0" size={18} />
                        <p>
                            <strong>"{selectedTask?.description}"</strong> görevi için kanıt belgesi (Sertifika, Fotoğraf, Katılım Belgesi vb.) yükleyiniz.
                            Belgeniz danışman onayına gönderilecektir.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Dosya Yükle</label>
                        <FileUpload
                            onFileSelect={(file) => console.log(file)}
                            accept=".pdf,.jpg,.jpeg,.png"
                            maxSize={5} // 5MB
                        />
                        <p className="text-xs text-slate-400">Desteklenen formatlar: PDF, JPG, PNG (Maks. 5MB)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Açıklama (İsteğe Bağlı)</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            placeholder="Etkinlik hakkında kısa bir not ekleyebilirsiniz..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setUploadModalOpen(false)}>İptal</Button>
                        <Button onClick={() => {
                            // Mock submission logic
                            setUploadModalOpen(false);
                            // Toast notification would go here
                        }}>
                            <Upload size={16} className="mr-2" /> Gönder
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
