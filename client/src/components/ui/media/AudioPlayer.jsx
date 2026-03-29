import { useRef, useState } from 'react';

const AudioPlayer = ({ src, title, artist, className = '' }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Toggle Play/Pause
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Update progress
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setProgress((current / dur) * 100);
            setCurrentTime(formatTime(current));
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(formatTime(audioRef.current.duration));
        }
    };

    const handleSeek = (e) => {
        const clickPosition = e.nativeEvent.offsetX;
        const width = e.target.clientWidth;
        const clickPercent = clickPosition / width;
        if (audioRef.current && isFinite(audioRef.current.duration)) {
            audioRef.current.currentTime = clickPercent * audioRef.current.duration;
        }
    };

    return (
        <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4 ${className}`}>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0 shadow-md shadow-blue-200"
            >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>

            {/* Info & Progress */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-end mb-1">
                    <div className="flex flex-col truncate">
                        <span className="font-bold text-slate-800 text-sm truncate">{title || 'Ses Dosyası'}</span>
                        {artist && <span className="text-xs text-slate-500 truncate">{artist}</span>}
                    </div>
                    <div className="text-xs text-slate-400 font-mono tracking-wide">
                        {currentTime} / {duration}
                    </div>
                </div>

                <div
                    className="w-full h-2 bg-slate-100 rounded-full cursor-pointer relative overflow-hidden group"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform scale-125"></div>
                    </div>
                </div>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
                <button
                    onClick={() => {
                        const newMute = !isMuted;
                        setIsMuted(newMute);
                        if (audioRef.current) audioRef.current.muted = newMute;
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        if (audioRef.current) audioRef.current.volume = val;
                        setIsMuted(val === 0);
                    }}
                    className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
