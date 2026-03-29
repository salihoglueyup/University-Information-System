
const AvatarGroup = ({ avatars = [], max = 4, size = 'md', className = '' }) => {
    const visibleAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base"
    };

    return (
        <div className={`flex items-center -space-x-3 ${className}`}>
            {visibleAvatars.map((avatar, index) => (
                <div key={index} className="ring-2 ring-white rounded-full">
                    <Avatar src={avatar.src} alt={avatar.alt} fallback={avatar.fallback} size={size} />
                </div>
            ))}

            {remaining > 0 && (
                <div className={`
            flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold ring-2 ring-white
            ${sizeClasses[size]}
        `}>
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
