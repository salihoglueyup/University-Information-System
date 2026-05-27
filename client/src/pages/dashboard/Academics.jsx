import { useState } from 'react';
import { useFaculties } from '../../hooks/queries/useFaculties';
import { BookOpen, ChevronRight, FolderOpen, Layers } from 'lucide-react';
// Destructuring unsupported parts since our ui module just exports Card, we will use plain divs for Header/Title/Content.

const Academics = () => {
    const [stats] = useState({ totalStudents: 14401, totalProgs: 42 }); // Mock/Cached stats
    const { data: faculties = [] } = useFaculties();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Akademik Kokpit"
                description="Fakülte, Bölüm ve Program yönetim merkezi."
                icon={BookOpen}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Faculty List */}
                <div className="lg:col-span-2 space-y-4">
                    {faculties.map((fac) => (
                        <Card key={fac.id} className="hover:border-blue-300 transition-colors group p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{fac.name}</h3>
                                        <p className="text-sm text-slate-500">{fac.departments?.length || 0} Bölüm / Program</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 group-hover:text-blue-600">
                                    <ChevronRight />
                                </button>
                            </div>

                            {/* Department Preview */}
                            <div className="mt-4 pl-16 space-y-2">
                                {fac.departments?.slice(0, 3).map(dept => (
                                    <div key={dept.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <FolderOpen size={14} className="text-slate-400" />
                                            <span>{dept.name}</span>
                                        </div>
                                        <Badge variant="outline" size="sm">Active</Badge>
                                    </div>
                                ))}
                                {fac.departments?.length > 3 && (
                                    <p className="text-xs text-slate-400 italic pl-2">+ {fac.departments.length - 3} diğer bölüm</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 p-6">
                        <h3 className="font-bold text-lg mb-4">Akademik Özet</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-indigo-200">Toplam Fakülte</span>
                                <span className="font-mono text-xl">{faculties.length}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-indigo-200">Toplam Program</span>
                                <span className="font-mono text-xl">{stats.totalProgs}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-indigo-200">Toplam Öğrenci</span>
                                <span className="font-mono text-xl">{stats.totalStudents.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
import { Badge, Card, PageHeader } from '../../components/ui';

export default Academics;
