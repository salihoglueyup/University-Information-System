import { useState, useEffect } from 'react';
import { Mail, Star, Trash2, Archive, Search } from 'lucide-react';

// Components
import axiosInstance from '../../api/axiosInstance';
export default function Emails() {
    const [emailsData, setEmailsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await axiosInstance.get('/emails');
                setEmailsData(res.data?.emails || []);

            } catch (err) {
                console.error("E-postalar çekilemedi:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmails();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6"
        >
            {/* Sidebar (Folders) */}
            < div className="w-full md:w-64 flex-shrink-0 space-y-2" >
                <Button variant="primary" className="w-full justify-start mb-4" icon={Mail}>Yeni E-Posta</Button>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {[
                        { label: 'Gelen Kutusu', icon: Mail, count: 2, active: true },
                        { label: 'Yıldızlı', icon: Star, count: 0 },
                        { label: 'Arşiv', icon: Archive, count: 5 },
                        { label: 'Çöp Kutusu', icon: Trash2, count: 0 },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={`flex items-center justify-between w-full p-3 text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent pl-2'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </div>
                            {item.count > 0 && (
                                <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full font-bold">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div >

            {/* Email List */}
            < Card className="flex-1 flex flex-col overflow-hidden h-full" >
                {/* Toolbar */}
                < div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50" >
                    <div className="flex items-center gap-2">
                        <Checkbox />
                        <Button variant="ghost" size="sm" icon={Archive} />
                        <Button variant="ghost" size="sm" icon={Trash2} />
                    </div>
                    <div className="w-64">
                        <Input placeholder="E-Posta ara..." icon={Search} className="h-9" />
                    </div>
                </div >

                {/* List */}
                < div className="flex-1 overflow-y-auto divide-y divide-slate-100 relative" >
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                    {
                        emailsData.map((email) => (
                            <div
                                key={email._id || email.id}
                                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors group ${email.read ? 'bg-white' : 'bg-blue-50/30'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <Checkbox className="mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className={`text-sm truncate mr-2 ${email.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                                                {email.sender}
                                            </h4>
                                            <span className="text-xs text-slate-500 whitespace-nowrap">
                                                {email.date || new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h5 className={`text-sm mb-1 ${email.read ? 'text-slate-600' : 'font-semibold text-slate-800'}`}>
                                            {email.subject}
                                        </h5>
                                        <p className="text-xs text-slate-500 truncate group-hover:text-slate-600">
                                            {email.preview}
                                        </p>
                                    </div>
                                    <button className="text-slate-300 hover:text-amber-400 transition-colors">
                                        <Star size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    {
                        !isLoading && emailsData.length === 0 && (
                            <div className="text-center text-slate-500 py-10">Hiç e-posta bulunamadı.</div>
                        )
                    }
                </div >
            </Card >
        </motion.div >
    );
}
