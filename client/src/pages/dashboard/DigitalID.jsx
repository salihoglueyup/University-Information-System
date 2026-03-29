import { useState, useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import logo from '../../assets/Istanbul_Aydın_University_logo.svg.png';

// --- Sub-components for cleaner code ---

const HolographicOverlay = ({ x, y }) => {
    // Calculate gradient position based on mouse x/y
    const gradientX = useTransform(x, [0, 1], ["0%", "100%"]);
    const gradientY = useTransform(y, [0, 1], ["0%", "100%"]);

    return (
        <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-40 mix-blend-overlay"
            style={{
                background: useTransform(
                    [gradientX, gradientY],
                    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
                )
            }}
        />
    );
};

const NoiseTexture = () => (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ filter: 'contrast(120%) brightness(100%)' }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
);

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end">
            <span className="text-[9px] text-blue-200 font-medium uppercase tracking-wider">Sistem Saati</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
                {time.toLocaleTimeString('tr-TR')}
            </span>
        </div>
    );
};

export default function DigitalID() {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(null);

    // Motion Values for Tilt Effect
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    // Smooth spring physics for rotation
    const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        x.set(clientX / rect.width);
        y.set(clientY / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-8 py-4 px-2"
        >
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Shield className="text-blue-600 fill-current" /> Dijital Kimlik Kartı
                </h1>
                <p className="text-slate-500 text-sm">Resmi işlemler ve kampüs girişleri için geçerli kimliğiniz</p>
            </div>

            {/* 3D Card Stage */}
            <div
                className="perspective-1000 w-full aspect-[1.586/1] relative group cursor-pointer"
                onClick={handleFlip}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={cardRef}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-700 shadow-2xl rounded-2xl"
                    style={{
                        rotateX: isFlipped ? 0 : rotateX, // Only tilt when not flipped (or complex logic for both) - simplified: standard tilt works best on front
                        rotateY: isFlipped ? 180 : rotateY,
                    }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* --- FRONT FACE --- */}
                    <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white border border-white/10">
                        {/* Layers */}
                        <NoiseTexture />
                        <HolographicOverlay x={x} y={y} />

                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 mix-blend-overlay"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl translate-y-12 -translate-x-12 mix-blend-overlay"></div>

                        {/* Security Pattern (Guilloche-ish) */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                        {/* Top Bar: Contactless & Wifi */}
                        <div className="absolute top-5 right-6 flex items-center gap-3 opacity-90 z-20">
                            <Wifi className="w-5 h-5 opacity-70" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-6">
                            {/* Header */}
                            <div className="flex items-center gap-4" style={{ transform: "translateZ(30px)" }}>
                                <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-md flex items-center justify-center shrink-0">
                                    <img src={logo} alt="IAÜ" className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-0.5">
                                    <h2 className="font-bold text-lg leading-tight tracking-wide font-serif text-white uppercase drop-shadow-md">İstanbul Aydın</h2>
                                    <h2 className="font-bold text-sm leading-tight tracking-[0.2em] text-blue-200 uppercase">Üniversitesi</h2>
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="flex items-end gap-5 mt-2">
                                {/* Photo Frame with Hologram */}
                                <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out" style={{ transform: "translateZ(50px)" }}>
                                    <div className="p-1 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl backdrop-blur-md shadow-2xl border border-white/30 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 animate-pulse transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <img
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
                                            alt="Student"
                                            className="w-28 h-32 rounded-xl object-cover bg-slate-800 shadow-inner"
                                        />
                                    </div>
                                    {/* Security Badge */}
                                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-tr from-amber-300 to-yellow-500 p-1.5 rounded-full shadow-lg border-2 border-white ring-2 ring-amber-500/20 z-20">
                                        <Shield size={16} className="text-amber-900 fill-amber-900" />
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="flex-1 pb-1 space-y-3" style={{ transform: "translateZ(40px)" }}>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5 opacity-80">AKADEMİK KİMLİK</p>
                                            <LiveClock />
                                        </div>
                                        <p className="font-bold text-2xl tracking-wide text-white drop-shadow-md font-sans mt-0.5">Ali Yılmaz</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
                                        <div>
                                            <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5 opacity-80">ÖĞRENCİ NO</p>
                                            <p className="font-mono text-lg tracking-widest text-white font-bold drop-shadow-sm">B21123456</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5 opacity-80">DURUM</p>
                                            <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Aktif</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5 opacity-80">BÖLÜM</p>
                                        <p className="text-sm font-semibold text-white/95 truncate">Yazılım Mühendisliği</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Holographic Strip */}
                        <div className="absolute bottom-4 right-0 w-2/3 h-8 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none z-0"></div>
                    </div>

                    {/* --- BACK FACE --- */}
                    <div
                        className="absolute inset-0 backface-hidden w-full h-full rounded-2xl overflow-hidden bg-slate-50 text-slate-800 p-6 rotate-y-180 flex flex-col border border-slate-200 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-fixed"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        {/* Subtle Header */}
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-200">
                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">RESMİ KİMLİK BİLGİLERİ</h3>
                                <p className="text-[10px] text-slate-500 font-mono">TC NO: 123*****456</p>
                            </div>
                            <QrCode className="text-slate-900 opacity-80" size={24} />
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mb-4">
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Kayıt Tarihi</p>
                                <p className="font-bold text-slate-700 font-mono">15.09.2021</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Geçerlilik</p>
                                <p className="font-bold text-slate-700 font-mono">30.09.2025</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Kan Grubu</p>
                                <p className="font-bold text-slate-700">A Rh+</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Doğum Tarihi</p>
                                <p className="font-bold text-slate-700 font-mono">01.01.2003</p>
                            </div>
                        </div>

                        {/* Legal / Barcode Area at Bottom */}
                        <div className="mt-auto space-y-3">
                            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-medium">
                                <Building2 size={12} />
                                <span>Florya Halit Aydın Yerleşkesi</span>
                            </div>

                            <div className="w-full bg-white p-2 rounded border border-slate-200 shadow-sm flex flex-col items-center gap-1">
                                {/* Fake Barcode */}
                                <div className="h-6 w-full opacity-80 bg-[repeating-linear-gradient(90deg,black,black_1px,transparent_1px,transparent_3px)]"></div>
                                <span className="text-[9px] font-mono tracking-widest text-slate-500">8847-1923-0012-5591</span>
                            </div>

                            <p className="text-[8px] text-slate-400 text-center leading-tight px-4">
                                Bu kartın mülkiyeti İstanbul Aydın Üniversitesi'ne aittir. Bulunması durumunda en yakın güvenlik birimine teslim ediniz.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFlip}
                    className="text-slate-500 hover:text-blue-600 gap-2 group transition-colors"
                >
                    <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" /> Kartı Çevir
                </Button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full py-6 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all rounded-xl shadow-sm group">
                    <Download size={20} className="mr-2 group-hover:scale-110 transition-transform" /> İndir
                </Button>
                <Button variant="outline" className="w-full py-6 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all rounded-xl shadow-sm group">
                    <Share2 size={20} className="mr-2 group-hover:scale-110 transition-transform" /> Paylaş
                </Button>
            </div>
        </motion.div>
    );
}
