import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function DocumentVerification() {
    const { hash } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [verificationData, setVerificationData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const verifyDocument = async () => {
            try {
                const res = await axiosInstance.get(`/verifications/${hash}`);
                setVerificationData(res.data);
            } catch (err) {
                console.error('Belge doğrulanamadı:', err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (hash) {
            verifyDocument();
        } else {
            setError(true);
            setIsLoading(false);
        }
    }, [hash]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-bold text-3xl">U</span>
                    </div>
                </div>

                <Card className="p-8 text-center bg-white shadow-xl shadow-slate-200/50 border-0">
                    {isLoading ? (
                        <div className="py-12">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <h2 className="text-lg font-bold text-slate-800">Dogrulaniyor...</h2>
                            <p className="text-slate-500 text-sm mt-2">Belge kayitlari kontrol ediliyor</p>
                        </div>
                    ) : error || !verificationData ? (
                        <div className="py-8">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Gecersiz Belge</h2>
                            <p className="text-slate-600 mb-6">
                                Sistemimizde bu koda sahip gecerli bir resmi evrak kaydi bulunamadi.
                            </p>
                            <Link to="/login">
                                <Button variant="outline" className="w-full">Sisteme Don</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="py-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Belge Dogrulandi</h2>
                            <p className="text-emerald-600 font-medium bg-emerald-50 py-1.5 px-4 rounded-full inline-block mb-8 text-sm">
                                Bu resmi belge gecerlidir.
                            </p>

                            <div className="text-left bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Belge Turu</p>
                                    <p className="text-slate-800 font-bold flex items-center gap-2">
                                        <FileText size={16} className="text-blue-500" />
                                        {verificationData.documentType}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Ogrenci</p>
                                        <p className="text-slate-800 font-bold">{verificationData.studentName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Numara</p>
                                        <p className="text-slate-800 font-bold">{verificationData.studentId}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Olusturulma Tarihi</p>
                                    <p className="text-slate-800 font-bold">
                                        {verificationData.createdAt ? new Date(verificationData.createdAt).toLocaleString('tr-TR') : '-'}
                                    </p>
                                </div>
                            </div>

                            <Link to="/login" className="mt-8 block">
                                <Button variant="outline" className="w-full" icon={ArrowLeft}>UBIS Anasayfa</Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
