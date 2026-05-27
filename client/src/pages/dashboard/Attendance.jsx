
// Components
import { useAttendance } from '../../hooks/useAttendance';

export default function Attendance() {
    const { data: attendanceData = [], isLoading } = useAttendance();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Devamsızlık Durumu</h1>
                    <p className="text-slate-500 text-sm">Ders bazlı devamlılık takibi</p>
                </div>
                <Badge variant="warning" className="text-sm px-3 py-1">
                    <AlertTriangle size={14} className="mr-2" />
                    Devamsızlık Sınırı: %30
                </Badge>
            </div>

            <Alert variant="info" title="Devam Zorunluluğu Hakkında">
                Yükseköğretim Kanunu gereğince derslerin teorik kısmının %70'ine, uygulamalı kısmının ise %80'ine devam zorunluluğu bulunmaktadır.
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    attendanceData.map((course) => {
                        // Calculate status color and text based on percentage
                        const isRisk = course.percent < 75; // Less than 75% attendance is risky
                        const isCritical = course.percent < 70; // Fail limit

                        let statusColor = 'bg-emerald-500';
                        let statusText = 'İyi Durumda';

                        if (isCritical) {
                            statusColor = 'bg-red-500';
                            statusText = 'Devamsızlıktan Kaldı';
                        } else if (isRisk) {
                            statusColor = 'bg-amber-500';
                            statusText = 'Riskli Sınırda';
                        }

                        return (
                            <Card key={course.code} className="hover:shadow-md transition-shadow">
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="font-mono text-xs">{course.code}</Badge>
                                                {isCritical ? (
                                                    <Badge variant="danger" className="text-xs">Kritik</Badge>
                                                ) : (
                                                    <Badge variant="success" className="text-xs">Devam Ediyor</Badge>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-800">{course.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-slate-800">%{course.percent}</div>
                                            <p className="text-xs text-slate-400">Katılım Oranı</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500">Devam Edilen: <b className="text-emerald-600">{course.attended}</b></span>
                                            <span className="text-slate-500">Devamsızlık: <b className="text-red-500">{course.absent}</b></span>
                                            <span className="text-slate-400">Toplam: {course.total}</span>
                                        </div>
                                        <ProgressBar
                                            value={course.percent}
                                            max={100}
                                            height="h-3"
                                            colorClass={statusColor}
                                        />
                                        <p className={`text-xs mt-2 font-medium ${isCritical ? 'text-red-600' : isRisk ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            Durum: {statusText}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    }))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Alert, Badge, Card, ProgressBar } from '../../components/ui';
