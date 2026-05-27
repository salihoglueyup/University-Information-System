import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const handleAppInstalled = () => {
            setShowInstallBtn(false);
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome: _outcome } = await deferredPrompt.userChoice;
        
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowInstallBtn(false);
    };

    if (!showInstallBtn) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-400 cursor-pointer hover:bg-indigo-700 transition-colors"
                onClick={handleInstallClick}
            >
                <Download size={20} />
                <span className="font-bold text-sm">Uygulamayı İndir (Ana Ekrana Ekle)</span>
            </motion.div>
        </AnimatePresence>
    );
}
