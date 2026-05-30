import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Clock, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { Button, Input, Modal, Select } from '../../components/ui';
import { useOfficeHours, useCreateOfficeHour, useDeleteOfficeHour, useAppointments } from '../../hooks/queries/useAppointments';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

export default function OfficeHours() {
    const { data: slots = [] } = useOfficeHours();
    const { data: appointments = [] } = useAppointments();
    const createSlot = useCreateOfficeHour();
    const deleteSlot = useDeleteOfficeHour();

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ day: 'Pazartesi', time: '', location: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        createSlot.mutate(form, {
            onSuccess: () => {
                toast.success('Ofis saati eklendi.');
                setOpen(false);
                setForm({ day: 'Pazartesi', time: '', location: '' });
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Ofis saati eklenemedi.')
        });
    };

    const handleDelete = (id) => {
        deleteSlot.mutate(id, {
            onSuccess: () => toast.success('Ofis saati silindi.'),
            onError: () => toast.error('Silme işlemi başarısız.')
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <Clock size={24} />
                        </div>
                        Ofis Saati (Office Hours)
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Öğrenci görüşmeleri için uygunluk saatlerinizi yönetin.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all"
                    >
                        <Plus size={18} />
                        Yeni Saat Ekle
                    </button>
                </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {DAYS.map(day => (
                    <div key={day} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 min-h-[300px]">
                        <h3 className="font-bold text-gray-800 text-center pb-2 border-b border-gray-100">{day}</h3>

                        <div className="flex-grow space-y-3">
                            <AnimatePresence>
                                {slots.filter(s => s.day === day).map(slot => (
                                    <motion.div
                                        key={slot.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 group relative hover:shadow-md transition-all"
                                    >
                                        <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                                            <Clock size={14} />
                                            {slot.time}
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center gap-1.5">
                                            <MapPin size={12} />
                                            {slot.location}
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(slot.id)}
                                                disabled={deleteSlot.isPending}
                                                className="p-1 hover:bg-white rounded-lg text-red-400 hover:text-red-500 disabled:opacity-50 transition-colors shadow-sm"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {slots.filter(s => s.day === day).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                    <Clock size={24} />
                                    <span className="text-xs font-medium">Boş</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-blue-500" />
                    Yaklaşan Randevular
                </h3>
                <div className="space-y-4">
                    {appointments.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">Yaklaşan randevu bulunmamaktadır.</p>
                    )}
                    {appointments.map(appt => (
                        <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-2 rounded-lg text-blue-600 font-bold text-center border border-gray-100 shadow-sm min-w-[60px]">
                                    <span className="block text-xs uppercase">{appt.date}</span>
                                    <span className="text-xl">{appt.time}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{appt.student}</h4>
                                    <p className="text-sm text-gray-500">{appt.topic}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${appt.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {appt.status || 'Bekliyor'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Slot Modal */}
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Yeni Ofis Saati" size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Gün"
                        value={form.day}
                        onChange={(e) => setForm({ ...form, day: e.target.value })}
                        options={DAYS.map(d => ({ value: d, label: d }))}
                    />
                    <Input
                        label="Saat Aralığı"
                        placeholder="10:00 - 12:00"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        required
                    />
                    <Input
                        label="Konum"
                        placeholder="B-204"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createSlot.isPending}>Ekle</Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
