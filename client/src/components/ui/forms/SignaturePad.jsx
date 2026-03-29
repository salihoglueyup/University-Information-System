import { useRef, useState } from 'react';

const SignaturePad = ({ onEnd, className = '' }) => {
    const sigCanvas = useRef({});
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current.clear();
        setIsEmpty(true);
        if (onEnd) onEnd(null);
    };

    const save = () => {
        if (sigCanvas.current.isEmpty()) return;
        const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        if (onEnd) onEnd(dataURL);
    };

    const handleEnd = () => {
        setIsEmpty(sigCanvas.current.isEmpty());
    };

    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm ${className}`}>
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">İmza Alanı</span>
                <div className="flex gap-2">
                    <button
                        onClick={clear}
                        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Temizle"
                        type="button"
                    >
                        <Eraser size={16} />
                    </button>
                    <button
                        onClick={save}
                        disabled={isEmpty}
                        className={`p-1.5 rounded-md transition-colors ${isEmpty ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                        title="Kaydet / Onayla"
                        type="button"
                    >
                        <Check size={16} />
                    </button>
                </div>
            </div>
            <div className="h-40 bg-white">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{ className: 'w-full h-full' }}
                    onEnd={handleEnd}
                />
            </div>
        </div>
    );
};

export default SignaturePad;
