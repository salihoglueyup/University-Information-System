import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '../assets/Istanbul_Aydın_University_logo.svg.png';
import loginBg from '../assets/03.jpg';
import axiosInstance from '../api/axiosInstance';
import { setAuthSession } from '../utils/authStorage';
import { toast } from 'react-toastify';

// Background Particles Component
const Particles = () => {
    const [particles] = useState(() => {
        return [...Array(20)].map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 10 + 10,
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            yTarget: Math.random() * -100
        }));
    });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    initial={{
                        x: particle.x,
                        y: particle.y,
                        scale: particle.scale,
                    }}
                    animate={{
                        y: [null, particle.yTarget],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: particle.width,
                        height: particle.height,
                    }}
                />
            ))}
        </div>
    );
};


// Validation Schema
const loginSchema = z.object({
    username: z.string().min(5, 'Kullanıcı adı en az 5 karakter olmalıdır').nonempty('Kullanıcı adı gereklidir'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').nonempty('Şifre gereklidir')
});

export default function CorporateLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

    // 2FA States
    const [requires2FA, setRequires2FA] = useState(false);
    const [tempToken, setTempToken] = useState("");
    const [otp, setOtp] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    // Static announcements data
    const announcements = [
        {
            id: 1,
            title: "Bahar Dönemi Kayıt Yenileme",
            text: "2025-2026 Bahar dönemi ders kayıtları 15 Şubat`ta başlıyor."
        },
        {
            id: 2,
            title: "Erasmus+ Başvuruları",
            text: "Yeni dönem Erasmus+ sınav başvuruları için son gün 20 Mart."
        },
        {
            id: 3,
            title: "Kampüs Kart Dağıtımı",
            text: "Yeni öğrenci kimlik kartlarınızı D Blok öğrenci işlerinden alabilirsiniz."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [announcements.length]);

    const handleLogin = async (data) => {
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/auth/login', data);
            
            if (res.data.requires2FA) {
                setRequires2FA(true);
                setTempToken(res.data.tempToken);
                return;
            }

            // Extract token and user details
            const { accessToken, ...userData } = res.data;

            // Map backend user fields to what the frontend expects
            const mappedUser = {
                ...userData,
                name: userData.fullName || userData.username,
                avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.username}`,
                permLevel: userData.role === 'admin' ? 5 : userData.role === 'academic' ? 3 : 1,
                token: accessToken
            };

            setAuthSession(mappedUser, accessToken);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                toast.error(error.response.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol ediniz.');
            } else {
                toast.error('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosInstance.post('/auth/2fa/verify', 
                { token: otp }, 
                { headers: { Authorization: `Bearer ${tempToken}` } }
            );

            const { accessToken, ...userData } = res.data;

            const mappedUser = {
                ...userData,
                name: userData.fullName || userData.username,
                avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.username}`,
                permLevel: userData.role === 'admin' ? 5 : userData.role === 'academic' ? 3 : 1,
                token: accessToken
            };

            setAuthSession(mappedUser, accessToken);
            window.location.href = '/dashboard';
        } catch {
            toast.error('Geçersiz OTP kodu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    // Parallax Effect for Background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        mouseX.set(x);
        mouseY.set(y);
    };

    const bgX = useTransform(mouseX, [-0.5, 0.5], ['-2%', '2%']);
    const bgY = useTransform(mouseY, [-0.5, 0.5], ['-2%', '2%']);

    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0f172a]"
            onMouseMove={handleMouseMove}
        >
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    style={{ x: bgX, y: bgY, scale: 1.1 }}
                    className="absolute inset-0"
                >
                    <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-40" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-slate-900/90 mix-blend-multiply" />
            </div>

            {/* Animated Particles */}
            <Particles />

            {/* Main Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-5xl h-[650px] bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Side - Visual & Info */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-between text-white relative bg-gradient-to-br from-blue-600/40 to-purple-600/40">
                    <div className="relative z-10">
                        <motion.img
                            src={logo}
                            alt="Logo"
                            className="h-20 mb-8 drop-shadow-lg brightness-0 invert opacity-90"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        />
                        <motion.h1
                            className="text-5xl font-bold mb-4 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            UBIS<br />
                            <span className="text-blue-200 font-light text-3xl">Giriş Portalı</span>
                        </motion.h1>
                        <motion.p
                            className="text-white/80 text-lg max-w-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            İstanbul Aydın Üniversitesi Bütünleşik Bilgi Sistemi
                        </motion.p>
                    </div>

                    {/* Announcement Carousel */}
                    <motion.div
                        className="p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-green-300">Duyurular</span>
                        </div>

                        <div className="h-20">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentAnnouncement}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="absolute w-full"
                                >
                                    <h3 className="font-bold text-lg mb-1">{announcements[currentAnnouncement].title}</h3>
                                    <p className="text-sm text-white/70 line-clamp-2 pr-8">
                                        {announcements[currentAnnouncement].text}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-1.5 mt-2">
                            {announcements.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`h-1 rounded-full ${idx === currentAnnouncement ? 'bg-white' : 'bg-white/30'}`}
                                    animate={{ width: idx === currentAnnouncement ? 24 : 8 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="IAU Logo" className="h-16 w-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hoş Geldiniz</h2>
                        <p className="text-gray-500 mb-8">Devam etmek için lütfen giriş yapın.</p>

                        {!requires2FA ? (
                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Kullanıcı Adı</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm`}
                                        placeholder="Örn: 20250001"
                                        {...register('username')}
                                    />
                                </div>
                                {errors.username && <p className="text-sm text-red-500 ml-1 mt-1">{errors.username.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm`}
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500 ml-1 mt-1">{errors.password.message}</p>}
                                <div className="flex justify-end mt-2">
                                    <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                        Şifremi Unuttum?
                                    </a>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Giriş Yap <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                        ) : (
                        <motion.form 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleVerify2FA} 
                            className="space-y-5"
                        >
                            <div className="flex justify-center mb-4 text-blue-600">
                                <ShieldCheck size={48} />
                            </div>
                            <p className="text-gray-600 text-center mb-4 text-sm">
                                Hesabınız İki Aşamalı Doğrulama (2FA) ile korunmaktadır. Lütfen Google Authenticator uygulamanızdaki 6 haneli kodu giriniz.
                            </p>
                            <div className="space-y-2">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full text-center tracking-[0.5em] text-2xl py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-800 placeholder-gray-300"
                                        placeholder="000000"
                                        required
                                    />
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Doğrula ve Giriş Yap"
                                )}
                            </motion.button>
                            <button
                                type="button"
                                onClick={() => { setRequires2FA(false); setOtp(""); setTempToken(""); }}
                                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
                            >
                                ← Geri Dön
                            </button>
                        </motion.form>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/40 text-xs font-medium tracking-wide">
                © 2026 İSTANBUL AYDIN ÜNİVERSİTESİ. TÜM HAKLARI SAKLIDIR. v3.0.1
            </div>
        </div>
    );
}
