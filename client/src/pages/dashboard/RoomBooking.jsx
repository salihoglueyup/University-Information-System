import { useState } from 'react';
import { Calendar as CalendarIcon, CalendarIcon, CheckCircle, Clock, MapPin, Search, Users } from 'lucide-react';

const ROOMS = [
    { id: '101', name: 'A-101 Toplantı Salonu', capacity: 20, type: 'Toplantı', status: 'available' },
    { id: '102', name: 'A-102 Seminer Odası', capacity: 45, type: 'Seminer', status: 'booked' },
    { id: '201', name: 'B-201 Grup Çalışma Odası', capacity: 6, type: 'Çalışma', status: 'available' },
    { id: '202', name: 'B-202 Bireysel Çalışma', capacity: 1, type: 'Çalışma', status: 'available' },
    { id: '301', name: 'C-301 Konferans Salonu', capacity: 150, type: 'Konferans', status: 'available' }
];

const TIME_SLOTS = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00',
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
];

const RoomBooking = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('any');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);

    const filteredRooms = ROOMS.filter(r => {
        if (selectedCapacity === 'any') return true;
        if (selectedCapacity === 'small') return r.capacity <= 10;
        if (selectedCapacity === 'medium') return r.capacity > 10 && r.capacity <= 50;
        if (selectedCapacity === 'large') return r.capacity > 50;
        return true;
    });

    const handleRoomSelect = (room) => {
        if (room.status === 'available') {
            setSelectedRoom(room);
            setIsBookingSuccess(false);
        }
    };

    const handleBooking = (e) => {
        e.preventDefault();
        // Mock successful booking
        setIsBookingSuccess(true);
        setTimeout(() => {
            setSelectedRoom(null);
            setIsBookingSuccess(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tesis & Oda Rezervasyonu"
                description="Grup çalışmaları, toplantılar ve etkinlikler için kampüs içi mekan rezervasyonu yapın."
                icon={CalendarIcon}
                breadcrumbs={[
                    { label: 'Gösterge Paneli', path: '/dashboard' },
                    { label: 'Kampüs Yaşamı', path: '/dashboard/room-booking' },
                    { label: 'Oda Rezervasyonu' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Search / Filter Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-indigo-500" />
                            Mekan Ara
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih Seçin</label>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kapasite</label>
                                <Select
                                    value={selectedCapacity}
                                    onChange={(e) => setSelectedCapacity(e.target.value)}
                                    className="w-full"
                                    options={[
                                        { value: 'any', label: 'Farketmez' },
                                        { value: 'small', label: 'Küçük (1-10 Kişi)' },
                                        { value: 'medium', label: 'Orta (11-50 Kişi)' },
                                        { value: 'large', label: 'Büyük (50+ Kişi)' },
                                    ]}
                                />
                            </div>
                            <Button className="w-full" variant="primary">
                                Uygun Odaları Bul
                            </Button>
                        </div>
                    </Card>

                    {/* Active Booking Reminder Mock */}
                    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                        <div className="flex items-start gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-indigo-900">Yaklaşan Rezervasyon</h4>
                                <p className="text-sm text-indigo-700 mt-1">Bugün 14:00 - B-201 Grup Çalışma Odası</p>
                                <Button variant="ghost" size="sm" className="mt-2 text-indigo-600 hover:bg-indigo-100 p-0 h-auto">
                                    Detayları Görüntüle
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Rooms List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">Mevcut Odalar</h3>
                        <span className="text-sm text-slate-500">{filteredRooms.length} oda bulundu</span>
                    </div>

                    {filteredRooms.map(room => (
                        <Card
                            key={room.id}
                            className={`p-5 transition-all cursor-pointer border-l-4 ${room.status === 'available'
                                    ? (selectedRoom?.id === room.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-emerald-400 hover:shadow-md')
                                    : 'border-slate-300 opacity-60 cursor-not-allowed bg-slate-50 relative overflow-hidden'
                                }`}
                            onClick={() => handleRoomSelect(room)}
                        >
                            {room.status !== 'available' && (
                                <div className="absolute inset-0 bg-slate-100/50 flex flex-col items-center justify-center backdrop-blur-[1px] z-10">
                                    <Badge variant="secondary" className="bg-slate-200 text-slate-600 mb-1 z-20 shadow-sm relative">Dolu / Rezerve Edildi</Badge>
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-800 text-lg">{room.name}</h4>
                                        <Badge variant={room.status === 'available' ? 'success' : 'secondary'} className="text-xs">
                                            {room.status === 'available' ? 'Uygun' : 'Dolu'}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {room.capacity} Kişilik</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {room.type}</span>
                                    </div>
                                </div>
                                <Button
                                    variant={selectedRoom?.id === room.id ? "primary" : "outline"}
                                    className="hidden sm:block pointer-events-none" // Controlled by card click
                                    disabled={room.status !== 'available'}
                                >
                                    {selectedRoom?.id === room.id ? 'Seçildi' : 'Seç'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Booking Modal Overlay Mock */}
            {selectedRoom && !isBookingSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Rezervasyonu Tamamla</h3>
                            <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-slate-600">
                                <Clock className="w-5 h-5 rotate-45" /> {/* Use as close icon roughly */}
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="font-semibold text-slate-800 mb-1">{selectedRoom.name}</div>
                            <div className="text-sm text-slate-500">Kapasite: {selectedRoom.capacity} Kişi</div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Saat Aralığı</label>
                                <Select options={TIME_SLOTS.map(t => ({ value: t, label: t }))} className="w-full" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (İsteğe Bağlı)</label>
                                <Input component="textarea" rows={3} placeholder="Rezervasyon amacınızı kısaca belirtin..." className="w-full" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setSelectedRoom(null)} type="button">İptal</Button>
                                <Button variant="primary" type="submit">Rezervasyonu Onayla</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {isBookingSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Rezervasyon Başarılı!</h3>
                        <p className="text-slate-600 text-sm">Oda rezervasyonunuz sistem tarafından onaylandı. Detaylar e-posta adresinize gönderildi.</p>
                    </Card>
                </div>
            )}

        </div>
    );
};
import { Badge, Button, Card, Input, PageHeader, Select } from '../../components/ui';

export default RoomBooking;
