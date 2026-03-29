import { useState } from 'react';

import { appointments, officeHours } from '../../data/mockData';

export default function AppointmentScheduler() {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAppointments = appointments.filter(apt => {
        const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
        const matchesSearch = apt.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.topic.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Onaylandı': return 'success';
            case 'Bekliyor': return 'warning';
            case 'İptal': return 'danger';
            case 'Tamamlandı': return 'neutral';
            default: return 'primary';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Randevu ve Ofis Saatleri"
                description="Öğrenci randevularını ve ofis saatlerini yönetin."
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Randevu Yönetimi', href: '/dashboard/appointments' },
                ]}
            >
                <div className="flex gap-3">
                    <Button variant="outline">
                        <CalendarIcon size={18} className="mr-2" />
                        Takvim Görünümü
                    </Button>
                    <Button variant="primary">
                        <Plus size={18} className="mr-2" />
                        Ofis Saati Ekle
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Office Hours Configuration */}
                <div className="space-y-6">
                    <Card title="Ofis Saatlerim">
                        <div className="space-y-4">
                            {officeHours.map((slot, index) => (
                                <div key={index} className="p-4 rounded-xl border border-gray-100 bg-blue-50/50 flex justify-between items-center group hover:border-blue-200 transition-colors">
                                    <div>
                                        <div className="font-bold text-gray-800 flex items-center gap-2">
                                            <CalendarIcon size={16} className="text-blue-600" />
                                            {slot.day}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                            <Clock size={14} />
                                            {slot.time}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <MapPin size={12} />
                                            {slot.location}
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={18} className="text-gray-400" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full border-dashed">
                                + Yeni Aralık Ekle
                            </Button>
                        </div>
                    </Card>

                    <Card title="Randevu İstatistikleri">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-green-50 text-center">
                                <div className="text-2xl font-bold text-green-700">{appointments.filter(a => a.status === 'Onaylandı').length}</div>
                                <div className="text-xs text-green-600 font-medium">Onaylanan</div>
                            </div>
                            <div className="p-4 rounded-xl bg-yellow-50 text-center">
                                <div className="text-2xl font-bold text-yellow-700">{appointments.filter(a => a.status === 'Bekliyor').length}</div>
                                <div className="text-xs text-yellow-600 font-medium">Bekleyen</div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 text-center">
                                <div className="text-2xl font-bold text-blue-700">{appointments.filter(a => a.status === 'Tamamlandı').length}</div>
                                <div className="text-xs text-blue-600 font-medium">Tamamlanan</div>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 text-center">
                                <div className="text-2xl font-bold text-red-700">{appointments.filter(a => a.status === 'İptal').length}</div>
                                <div className="text-xs text-red-600 font-medium">İptal/Ret</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Appointment Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Randevu Talepleri">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Öğrenci veya konu ara..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Bekliyor', 'Onaylandı'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${filterStatus === status
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {status === 'All' ? 'Tümü' : status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredAppointments.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                                    <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
                                    <p>Kriterlere uygun randevu bulunamadı.</p>
                                </div>
                            ) : (
                                filteredAppointments.map(apt => (
                                    <div key={apt.id} className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all bg-white relative group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                    {apt.student.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900">{apt.student}</h3>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{apt.studentId}</span>
                                                    </div>
                                                    <p className="font-medium text-gray-800 mb-2">{apt.topic}</p>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                                                            <CalendarIcon size={14} /> {apt.date}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                                                            <Clock size={14} /> {apt.time}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                                                            {apt.type === 'Online' ? <Video size={14} /> : <Users size={14} />}
                                                            {apt.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                <Badge variant={getStatusVariant(apt.status)}>
                                                    {apt.status}
                                                </Badge>

                                                {apt.status === 'Bekliyor' && (
                                                    <div className="flex gap-2 mt-2">
                                                        <Button size="sm" variant="success" className="h-8">
                                                            <CheckCircle size={16} className="mr-1" /> Onayla
                                                        </Button>
                                                        <Button size="sm" variant="danger" className="h-8">
                                                            <XCircle size={16} className="mr-1" /> Reddet
                                                        </Button>
                                                    </div>
                                                )}

                                                {apt.status === 'Onaylandı' && apt.type === 'Online' && (
                                                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                                                        <Video size={16} className="mr-2" /> Toplantıya Git
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
