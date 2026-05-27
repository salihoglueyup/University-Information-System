import React from 'react';
import { Clock, Download, MapPin, Printer } from 'lucide-react';

// Components

// Mock Data
import { schedule } from '../../data/mockData';

export default function Schedule() {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
    const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9); // 09:00 - 17:00 (Start hours)

    // Helper to check if a course is in a specific slot
    const getCourseInSlot = (day, hour) => {
        return schedule.find(s => {
            const startHour = parseInt(s.start.split(':')[0]);
            const endHour = parseInt(s.end.split(':')[0]);
            return s.day === day && hour >= startHour && hour < endHour;
        });
    };

    // Helper to determine row span (duration)
    const getDuration = (course) => {
        const start = parseInt(course.start.split(':')[0]);
        const end = parseInt(course.end.split(':')[0]);
        return end - start;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Ders Programım</h1>
                    <p className="text-slate-500 text-sm">Haftalık ders ve sınıf bilgileri</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Printer}>Yazdır</Button>
                    <Button variant="primary" size="sm" icon={Download}>PDF İndir</Button>
                </div>
            </div>

            <Card className="overflow-x-auto">
                <div className="min-w-[800px] p-6">
                    <div className="grid grid-cols-6 gap-2">
                        {/* Header Row: Days */}
                        <div className="bg-slate-50 p-3 rounded-lg text-center font-bold text-slate-400 text-xs uppercase tracking-wider">
                            Saat
                        </div>
                        {days.map(day => (
                            <div key={day} className="bg-slate-100 p-3 rounded-lg text-center font-bold text-slate-700">
                                {day}
                            </div>
                        ))}

                        {/* Time Slots & Courses */}
                        {timeSlots.map(hour => (
                            <React.Fragment key={hour}>
                                {/* Time Column */}
                                <div className="text-center text-xs text-slate-400 font-mono py-4 border-t border-slate-100">
                                    {`${hour}:00`}
                                </div>

                                {/* Days Columns */}
                                {days.map(day => {
                                    const course = getCourseInSlot(day, hour);

                                    // If this slot is the START of a course, render it
                                    if (course && parseInt(course.start) === hour) {
                                        const duration = getDuration(course);
                                        return (
                                            <div
                                                key={`${day}-${hour}`}
                                                className="relative z-10"
                                                style={{ gridRow: `span ${duration}` }}
                                            >
                                                <div className="h-full w-full bg-blue-50 border-l-4 border-blue-500 rounded-md p-2 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center gap-1">
                                                    <span className="text-xs font-bold text-blue-700 block truncate" title={course.course}>
                                                        {course.course}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[10px] text-blue-600/80">
                                                        <MapPin size={10} />
                                                        <span>{course.room}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-blue-600/80">
                                                        <Clock size={10} />
                                                        <span>{course.start} - {course.end}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // If this slot is occupied by a course starting earlier, render nothing (placeholder handled by grid span)
                                    // BUT, we need to be careful with CSS grid auto-placement. 
                                    // Actually, in a strict grid, spanning items take space. 
                                    // Gaps need to be filled if we are iterating cell by cell.
                                    // Simpler approach: Iterate fully, but check if we are 'inside' a course.
                                    // If we are inside (start < hour < end), we render NOTHING if grid-row-span handles it.
                                    // BUT React loop renders linear divs. 

                                    // Correction: A standard CSS grid with spanning requires careful placement or just use a Table-like structure.
                                    // Let's use a mapping approach where we check if a cell is "occupied" by a started course.
                                    // If it is the start, we render. If it's a continuation, we render a placeholder? No, the spanner takes the space.

                                    // Wait, if I use `grid-auto-flow: dense` it might work, but standard grid placement is better.
                                    // Let's keep it simple: Just Check if a course STARTS here.
                                    // If a course is running through here but started earlier, we DO NOT render a div here? 
                                    // If we don't render a div, the grid might collapse or shift.
                                    // We need to render an empty div if NO course is here. 
                                    // If a course STARTS here, we render spanning div.
                                    // If a course IS CURRENTLY RUNNING (started previous hour), we render NOTHING? 
                                    // Yes, because the spanning div from previous hour covers this track.

                                    if (getCourseInSlot(day, hour)) {
                                        // Occupied by course
                                        if (parseInt(getCourseInSlot(day, hour).start) === hour) {
                                            // Start of course - handled above
                                            // (Logic repeated for clarity inside comment block, but code flow executes above actually)
                                            // The code block UP THERE handles the "Start".
                                            // So if we are here, it means we are checking again.
                                            // Let's refine the logic.
                                            return null; // The span covers this
                                        }
                                        return null; // Covered by span
                                    }

                                    // Empty Slot
                                    return (
                                        <div key={`${day}-${hour}`} className="border-t border-slate-50 min-h-[80px]"></div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Button, Card } from '../../components/ui';
