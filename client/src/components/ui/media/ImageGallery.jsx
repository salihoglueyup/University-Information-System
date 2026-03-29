
import ImageViewer from './ImageViewer';

const ImageGallery = ({ images = [], gap = 4, className = '' }) => {
    // Simple grid layout logic
    // For true masonry, we'd need a library or more complex logic, but CSS grid is often enough.

    return (
        <div
            className={`grid ${className}`}
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
                gap: `${gap * 0.25}rem`
            }}
        >
            {images.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
                    <ImageViewer
                        src={img.src}
                        alt={img.alt || `Gallery Image ${idx + 1}`}
                        thumbClassName="aspect-[4/3] w-full h-full"
                    />
                    {(img.caption || img.title) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                            {img.title && <h4 className="font-bold text-sm truncate">{img.title}</h4>}
                            {img.caption && <p className="text-xs text-white/80 truncate">{img.caption}</p>}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
