import { useRef, useState } from 'react';

const FileUpload = ({ onFileSelect, accept, label = "Dosya Yükle", className = '' }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (inputRef.current) inputRef.current.value = '';
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`
          relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-blue-100 p-3 rounded-xl mb-3 text-blue-600">
                            <File size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1 px-4 text-center break-all">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400 mb-4">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                            onClick={removeFile}
                            className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                            Kaldır
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center p-6">
                        <div className={`
              p-4 rounded-full bg-white shadow-sm mb-4 transition-transform duration-300
              ${dragActive ? 'scale-110 text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
            `}>
                            <UploadCloud size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">
                            {label}
                        </p>
                        <p className="text-xs text-slate-400">
                            veya sürükleyip bırakın
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
