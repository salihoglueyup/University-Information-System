import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Cpu, CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { DataManager } from '../../../utils/DataManager';
import { getUser } from '../../../utils/authStorage';

export default function CampusAIWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba 👋 Ben IAÜ Kampüs Asistanı. Size notlarınız, devamsızlığınız veya kampüs hakkında yardımcı olabilirim.", sender: 'ai', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user', time: timeStr }]);
        setInput("");
        setIsTyping(true);

        // Smart mock AI logic resolving dynamically
        const lowerInput = userMsg.toLowerCase();
        let aiReply = "Üzgünüm, sorunuzu tam anlayamadım. Kampüs işleyişi, sınavlar, notlar veya harçlarla ilgili daha belirgin kelimeler kullanabilir misiniz?";

        try {
            if (lowerInput.includes('ortalamam') || lowerInput.includes('gno') || lowerInput.includes('notlarım')) {
                // Fetch dynamic grades
                const grades = await DataManager.getGradeData();
                const gpa = grades?.distribution?.find(item => item.name === 'GNO')?.value || 'Bilinmiyor';
                aiReply = `Sistemdeki verilere göre güncel Genel Not Ortalamanız (GNO): **${gpa}**'dır. Not dökümünüze (Transkript) Akademik > Ders Notlarım sayfasından ulaşabilirsiniz.`;
            }
            else if (lowerInput.includes('danışman') || lowerInput.includes('hoca')) {
                // Fetch user logic
                const parsedUser = getUser();
                if (parsedUser) {
                    const displayName = parsedUser.fullName || parsedUser.username || 'Öğrenci';
                    aiReply = `Bölüm danışmanınız ile görüşmek için bölüm sayfanızdan veya Öğrenci İşleri panelinden randevu alabilirsiniz. (Şu anki giriş yapan: ${displayName})`;
                } else {
                    aiReply = "Bölüm sayfanızda kendi akademik danışmanınıza ait bilgileri görebilirsiniz.";
                }
            }
            else if (lowerInput.includes('devamsızlık') || lowerInput.includes('yoklama')) {
                const attendance = await DataManager.getAttendanceData();
                const risky = attendance?.filter(a => a.status === 'Kritik') || [];
                if (risky.length > 0) {
                    aiReply = `Şu an risk sınırında olan **${risky.length} adet** dersiniz bulunuyor. Bunlardan biri: ${risky[0].courseName}. Lütfen e-kampüs Devamsızlık sayfasını kontrol ediniz.`;
                } else {
                    aiReply = "Sistem üzerinde risk sınırında olan bir devamsızlığınız görünmemektedir.";
                }
            }
            else if (lowerInput.includes('harç') || lowerInput.includes('para') || lowerInput.includes('borc')) {
                aiReply = "Harç ve diğer finansal işlemlerinizi soldaki menüden 'Finans ve Kampüs Kart' bölümünden gerçekleştirebilirsiniz.";
            }
            else if (lowerInput.includes('kütüphane') || lowerInput.includes('kitap') || lowerInput.includes('ödünç')) {
                aiReply = "Kütüphane kitap alma limitiniz Lisans öğrencileri için 5 kitap / 15 gündür. Detaylar İnteraktif Kütüphane sayfamızdadır.";
            }
            else if (lowerInput.includes('merhaba') || lowerInput.includes('selam')) {
                aiReply = "Merhaba, size nasıl yardımcı olabilirim? (Örn: GNO'm kaç?, Devamsızlığım var mı?)";
            }
        } catch (error) {
            console.error("AI Error", error);
            aiReply = "Şu an arka plan servislerimde bir yavaşlık var, lütfen daha sonra tekrar deneyin.";
        }

        // Simulate network delay for AI processing feel
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, sender: 'ai', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1200 + Math.random() * 800); // 1.2 - 2.0 seconds
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Widget Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative group"
                    >
                        <MessageSquare size={28} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
                        </span>

                        {/* Tooltip */}
                        <div className="absolute -top-12 right-0 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                            Kampüs Asistanı ile Sohbet Edin
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-[350px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden bottom-0 right-0 absolute transform origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 flex justify-between items-center text-white shrink-0 shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <Cpu size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">IAÜ Asistan</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                        Çevrimiçi
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                            <div className="text-center text-xs text-slate-400 my-4 flex items-center justify-center gap-2">
                                <span className="h-px w-8 bg-slate-200"></span>
                                Sohbet Başladı
                                <span className="h-px w-8 bg-slate-200"></span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-end gap-2 max-w-[85%]">
                                        {msg.sender === 'ai' && (
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mb-1">
                                                <Cpu size={12} className="text-blue-600" />
                                            </div>
                                        )}
                                        <div
                                            className={`p-3 text-sm shadow-sm ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] text-slate-400 mt-1 flex items-center gap-1 ${msg.sender === 'user' ? 'mr-1' : 'ml-8'}`}>
                                        {msg.time}
                                        {msg.sender === 'user' && <CheckCircle2 size={10} className="text-blue-500" />}
                                    </span>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 ml-1 text-slate-400">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Cpu size={12} className="text-blue-600" />
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Bir soru sorun..."
                                    className="w-full bg-transparent text-sm p-2 outline-none resize-none max-h-24 min-h-[40px] scrollbar-thin scrollbar-thumb-slate-200"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="p-2 bg-blue-600 text-white rounded-lg mb-1 mr-1 disabled:opacity-50 disabled:bg-slate-400 hover:bg-blue-700 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                                IAÜ Yapay Zeka Kampüs Asistanı
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
