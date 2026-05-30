import { UserPlus, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useStudentClubs, useJoinClub } from '../../hooks/queries/useStudentClubs';

export default function StudentClubs() {
    const { data: studentClubs = [] } = useStudentClubs();
    const joinClub = useJoinClub();

    const handleJoin = (id) => {
        joinClub.mutate(id, {
            onSuccess: () => toast.success('Kulübe üyeliğiniz alındı.'),
            onError: () => toast.error('Üyelik işlemi başarısız.')
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-pink-600" /> Öğrenci Kulüpleri
                    </h1>
                    <p className="text-slate-500 text-sm">İlgi alanınıza uygun kulüplere katılın ve sosyalleşin</p>
                </div>
                <Button variant="outline" icon={UserPlus}>Yeni Kulüp Başvurusu</Button>
            </div>

            {studentClubs.length === 0 && (
                <Card className="p-12 text-center text-slate-400 border-dashed">
                    <Users size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Şu anda aktif bir öğrenci kulübü bulunmamaktadır.</p>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentClubs.map((club) => (
                    <Card key={club.id} className="hover:shadow-lg transition-shadow duration-300 group">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">
                                {club.logo}
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{club.name}</h3>
                                <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{club.description}</p>
                            </div>

                            <div className="flex justify-center gap-4 text-xs font-medium text-slate-400 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1">
                                    <Users size={14} />
                                    <span>{club.members} Üye</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span>Aktif</span>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full mt-2" disabled={joinClub.isPending} onClick={() => handleJoin(club.id)}>Üye Ol</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Button, Card } from '../../components/ui';
