import { useState } from 'react';

const Calendar = ({ events = [], onDateSelect, className = '' }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    const renderDays = () => {
        const totalDays = daysInMonth(currentDate);
        // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
        let startDay = firstDayOfMonth(currentDate) - 1;
        if (startDay === -1) startDay = 6;

        const blanks = Array(startDay).fill(null);
        const days = Array.from({ length: totalDays }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="h-24 bg-slate-50/50 border border-slate-100"></div>;

            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
                <div
                    key={day}
                    onClick={() => onDateSelect && onDateSelect(dateStr)}
                    className={`
            h-24 border border-slate-100 p-2 relative group transition-colors hover:bg-slate-50 cursor-pointer
            ${isToday ? 'bg-blue-50/30' : 'bg-white'}
          `}
                >
                    <span className={`
            text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
            ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}
          `}>
                        {day}
                    </span>
                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)] scrollbar-hide">
                        {dayEvents.map((event, idx) => (
                            <div
                                key={idx}
                                className={`
                  text-[10px] truncate px-1.5 py-0.5 rounded
                  ${event.type === 'exam' ? 'bg-red-100 text-red-700' :
                                        event.type === 'assignment' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'}
                `}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {dayNames.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {renderDays()}
            </div>
        </div>
    );
};

export default Calendar;
