import { useState, useEffect } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { useSocket } from '../../../context/SocketContext';

export default function AnnouncementsWidget() {
    const [activeTab, setActiveTab] = useState('genel');
    const { socket } = useSocket();

    const tabs = [
        { id: 'genel', label: 'Genel' },
        { id: 'fakulte', label: 'Fakülte' },
        { id: 'ders', label: 'Ders' }
    ];

    const [announcements, setAnnouncements] = useState({ genel: [], fakulte: [], ders: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axiosInstance.get('/announcements');
                const data = res.data;

                // Reset grouped to clear old items when fetching
                const grouped = { genel: [], fakulte: [], ders: [] };
                data.forEach(item => {
                    const dateObj = new Date(item.date);
                    const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }).toUpperCase();

                    const mappedItem = {
                        id: item._id,
                        date: formattedDate,
                        title: item.title,
                        text: item.content || item.text
                    };

                    // Map based on real data enum ['Genel', 'Fakülte', 'Bölüm', 'Ders']
                    if (item.type === 'Genel') grouped.genel.push(mappedItem);
                    else if (item.type === 'Fakülte') grouped.fakulte.push(mappedItem);
                    else grouped.ders.push(mappedItem);
                });

                setAnnouncements(grouped);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();

        // Listen for real-time announcements
        if (socket) {
            const handleNewAnnouncement = (announcement) => {
                const dateObj = new Date(announcement.date || new Date());
                const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }).toUpperCase();

                const newMappedItem = {
                    id: announcement._id,
                    date: formattedDate,
                    title: announcement.title,
                    text: announcement.content || announcement.text
                };

                setAnnouncements(prev => {
                    const next = { ...prev };
                    if (announcement.type === 'Genel') next.genel = [newMappedItem, ...next.genel];
                    else if (announcement.type === 'Fakülte') next.fakulte = [newMappedItem, ...next.fakulte];
                    else next.ders = [newMappedItem, ...next.ders];
                    return next;
                });
            };

            socket.on('new_announcement', handleNewAnnouncement);
            return () => socket.off('new_announcement', handleNewAnnouncement);
        }

    }, [socket]);


    return (
        <div
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Bell className="text-purple-500" size={20} /> Duyurular
                </h3>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-200 pr-1 flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {announcements[activeTab].map((item) => (
                            <div key={item.id} className="group flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-blue-700 font-bold text-[10px] border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="text-sm leading-none">{item.date.split(' ')[0]}</span>
                                    <span className="uppercase text-[8px]">{item.date.split(' ')[1] || ''}</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors">{item.title}</h4>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!isLoading && announcements[activeTab].length === 0 && (
                            <p className="text-center text-xs text-slate-400 py-4">Bu kategoride duyuru bulunmamaktadır.</p>
                        )}
                    </>
                )}
            </div>

            <button className="w-full mt-auto pt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 border-t border-gray-50 uppercase tracking-wider">
                Tümünü Oku <ChevronRight size={12} />
            </button>
        </div>
    );
}
