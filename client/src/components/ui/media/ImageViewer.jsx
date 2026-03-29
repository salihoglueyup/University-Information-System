import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, ZoomIn, ZoomOut, X } from 'lucide-react';

const ImageViewer = ({ src, alt, thumbClassName = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(s => Math.min(s + 0.5, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(s => Math.max(s - 0.5, 0.5));
    };

    const handleClose = () => {
        setIsOpen(false);
        setScale(1);
    };

    return (
        <>
            <div
                className={`cursor-pointer group relative overflow-hidden rounded-xl ${thumbClassName}`}
                onClick={() => setIsOpen(true)}
            >
                <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-white drop-shadow-md" size={24} />
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                                onClick={handleClose}
                            />

                            <div className="absolute top-4 right-4 flex gap-2 z-[101]">
                                <button onClick={handleZoomOut} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                                    <ZoomOut size={20} />
                                </button>
                                <button onClick={handleZoomIn} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                                    <ZoomIn size={20} />
                                </button>
                                <button onClick={handleClose} className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative z-[101] max-w-[90vw] max-h-[90vh] overflow-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={src}
                                    alt={alt}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease-out' }}
                                    draggable={false}
                                />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default ImageViewer;
