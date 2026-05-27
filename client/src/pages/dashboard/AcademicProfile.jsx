import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, AwardIcon, Book, Briefcase, Calendar, Globe, GraduationCap, Mail, MapPin, Smartphone, User, Users } from 'lucide-react';
import { useStaffDetail } from '../../hooks/queries/useStaffDetail';

export default function AcademicProfile() {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Hardcoded for demo - in real app, derive from context or search
    const facultySlug = "muhendislik-fakultesi";
    const deptSlug = "bilgisayar-muhendisligi-ing";

    // Default ID if none provided (e.g. self-view)
    const targetId = staffId || "AC-171000";
    const { data: staff, isLoading: loading } = useStaffDetail(facultySlug, deptSlug, targetId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="p-10 text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Personel Bulunamadı</h2>
                <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Geri Dön</Button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Genel', icon: User },
        { id: 'qualifications', label: 'Eğitim & Nitelik', icon: GraduationCap },
        { id: 'research', label: 'Akademik', icon: Book },
        { id: 'schedule', label: 'Ders Programı', icon: Calendar },
        { id: 'administrative', label: 'İdari', icon: Briefcase },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Akademik Personel Profili"
                description={`${staff.title} ${staff.name} - ${staff.department}`}
            >
                <div className="flex gap-2">
                    <Button variant="outline">CV İndir</Button>
                    <Button variant="primary">Mesaj Gönder</Button>
                </div>
            </PageHeader>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-md"
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {staff.fullName}
                            {staff.role === 'Dean' && <Badge variant="danger">Dekan</Badge>}
                            {staff.role === 'Professor' && <Badge variant="primary">Profesör</Badge>}
                        </h2>
                        <p className="text-gray-500">{staff.faculty} / {staff.department}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} /> {staff.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Smartphone size={16} /> {staff.mobile}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} /> {staff.office}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {staff.links?.googleScholar && (
                            <a href={staff.links.googleScholar} target="_blank" rel="noreferrer" className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 transition-colors">
                                <Globe size={20} />
                            </a>
                        )}
                        {staff.links?.linkedin && (
                            <a href={staff.links.linkedin} target="_blank" rel="noreferrer" className="bg-blue-50 text-blue-700 p-2 rounded hover:bg-blue-100 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        )}
                        {staff.links?.researchGate && (
                            <a href={staff.links.researchGate} target="_blank" rel="noreferrer" className="bg-teal-50 text-teal-600 p-2 rounded hover:bg-teal-100 transition-colors">
                                <Book size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">H-Index</div>
                        <div className="text-2xl font-bold text-gray-900">{staff.research?.stats?.hIndex || '-'}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Atıf Sayısı</div>
                        <div className="text-2xl font-bold text-gray-900">{staff.research?.stats?.citations || '-'}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white border-b-2 border-indigo-600 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Ödüller & Başarılar">
                            {staff.awards?.awards && staff.awards.awards.length > 0 ? (
                                <ul className="space-y-4">
                                    {staff.awards.awards.map((award, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full h-fit">
                                                <AwardIcon size={18} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{award.title}</div>
                                                <div className="text-sm text-gray-500">{award.organization}, {award.year}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Kayıtlı ödül bulunmamaktadır.</p>
                            )}
                        </Card>

                        {(staff.advisees?.studentIds && staff.advisees.studentIds.length > 0) && (
                            <Card title="Danışmanlık">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-600">Aktif Danışmanlık Sayısı</span>
                                    <Badge variant="primary">{staff.advisees.studentIds.length} Öğrenci</Badge>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center text-blue-700 cursor-pointer hover:bg-blue-100 transition">
                                    <span className="font-medium">Öğrenci Listesini Görüntüle</span>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'qualifications' && (
                    <div className="space-y-6">
                        <Card title="Eğitim Bilgileri">
                            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 py-2">
                                {staff.qualifications?.degrees?.map((deg, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                                        <div className="text-sm text-gray-400 mb-1">{deg.year}</div>
                                        <h4 className="font-bold text-gray-900 text-lg">{deg.university}</h4>
                                        <p className="text-gray-600">{deg.level}, {deg.field}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Sertifikalar">
                                <div className="space-y-2">
                                    {staff.qualifications?.certifications?.map((cert, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-100">
                                            <AwardIcon size={16} className="text-green-600" />
                                            <span className="text-gray-700">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card title="Yabancı Diller">
                                <div className="flex flex-wrap gap-2">
                                    {staff.qualifications?.languages?.map((lang, idx) => (
                                        <Badge key={idx} variant="outline" className="text-sm py-1 px-3">{lang}</Badge>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'research' && (
                    <div className="space-y-6">
                        <Card title="Araştırma İlgileri">
                            <div className="flex flex-wrap gap-2">
                                {staff.research?.interests?.map((item, idx) => (
                                    <Badge key={idx} variant="primary">{item}</Badge>
                                ))}
                            </div>
                        </Card>

                        <Card title="Yayınlar (Son 5)">
                            <div className="space-y-4">
                                {staff.research?.papers?.slice(0, 5).map((paper, idx) => (
                                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <h4 className="font-semibold text-indigo-900 mb-1">{paper.title}</h4>
                                        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                                            <span>{paper.year}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="italic">{paper.citation}</span>
                                        </div>
                                        {paper.doi && (
                                            <a href={`https://doi.org/${paper.doi}`} className="text-xs text-blue-500 hover:underline mt-1 block">
                                                DOI: {paper.doi}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Projeler">
                            <div className="grid grid-cols-1 gap-4">
                                {staff.research?.projects?.map((proj, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg shadow-sm">
                                        <div>
                                            <div className="font-bold text-gray-800">{proj.title}</div>
                                            <div className="text-sm text-gray-500">{proj.role}</div>
                                        </div>
                                        <Badge variant={proj.status === 'Completed' ? 'success' : 'warning'}>{proj.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card title="Ofis Saatleri" className="md:col-span-1">
                            <div className="space-y-3">
                                {staff.schedule?.officeHours?.map((oh, idx) => (
                                    <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <div className="font-semibold text-green-800">{oh.day}</div>
                                        <div className="text-green-700">{oh.start} - {oh.end}</div>
                                        <div className="text-xs text-green-600 mt-1">{oh.location}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card title="Haftalık Ders Programı" className="md:col-span-2">
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Gün</th>
                                            <th className="px-4 py-3 text-left">Saat</th>
                                            <th className="px-4 py-3 text-left">Ders/Aktivite</th>
                                            <th className="px-4 py-3 text-left">Lokasyon</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {staff.schedule?.weeklySchedule?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium">{item.day}</td>
                                                <td className="px-4 py-3">{item.time}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="default">{item.course}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{item.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'administrative' && (
                    <Card title="İdari Görevler & Komiteler">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Users size={18} /> Komite Üyelikleri
                                </h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {staff.administrative?.committees?.map((comm, idx) => (
                                        <li key={idx}>{comm}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Briefcase size={18} /> Görevler
                                </h4>
                                <div className="space-y-2">
                                    {staff.administrative?.duties?.map((duty, idx) => (
                                        <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-100 text-sm font-medium">
                                            {duty}
                                        </div>
                                    ))}
                                    <div className="text-xs text-gray-400 mt-2">
                                        Başlangıç: {staff.administrative?.startDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
import { Badge, Button, Card, PageHeader } from '../../components/ui';
