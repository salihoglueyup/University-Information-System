import { useState, useEffect, useCallback } from 'react';

const Carousel = ({ items = [], autoPlay = false, interval = 3000, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, nextSlide]);

    if (items.length === 0) return null;

    return (
        <div className={`relative group overflow-hidden rounded-xl ${className}`}>
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 h-full relative">
                        {item.content ? item.content : (
                            <>
                                <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover" />
                                {(item.title || item.description) && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                                        {item.title && <h3 className="text-lg font-bold">{item.title}</h3>}
                                        {item.description && <p className="text-sm opacity-90">{item.description}</p>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
                <ChevronLeft size={20} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
                <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`
              w-2 h-2 rounded-full transition-all
              ${currentIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}
            `}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
