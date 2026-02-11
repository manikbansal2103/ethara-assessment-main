import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = ({ records = [], onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthData = useMemo(() => {
        const days = daysInMonth(currentDate);
        const firstDay = firstDayOfMonth(currentDate);
        const data = [];

        // Padding for empty days before the 1st
        for (let i = 0; i < firstDay; i++) {
            data.push(null);
        }

        // Days of the month
        for (let i = 1; i <= days; i++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
            const record = records.find(r => r.date === dateStr);
            data.push({
                day: i,
                date: dateStr,
                status: record?.status,
                isToday: dateStr === new Date().toISOString().split('T')[0]
            });
        }

        return data;
    }, [currentDate, records]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-aura-light-border/20 dark:border-aura-dark-border/10">
                <motion.button
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevMonth}
                    className="p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-aura-dark-surface/50 text-aura-light-muted dark:text-aura-dark-muted transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </motion.button>
                <h3 className="text-sm font-black text-aura-light-text dark:text-white uppercase tracking-[0.3em]">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <motion.button
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-aura-dark-surface/50 text-aura-light-muted dark:text-aura-dark-muted transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </motion.button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted opacity-40 py-2 tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                <AnimatePresence mode="popLayout">
                    {monthData.map((item, index) => (
                        item ? (
                            <motion.button
                                key={item.date}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -2, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onDateSelect(item.date)}
                                className={`
                                    relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                    ${selectedDate === item.date
                                        ? 'bg-accent-primary-500 text-white shadow-aura-glow ring-4 ring-accent-primary-500/20 z-10'
                                        : item.isToday
                                            ? 'bg-neutral-100 dark:bg-aura-dark-surface text-accent-primary-500 font-black'
                                            : 'hover:bg-neutral-50 dark:hover:bg-aura-dark-surface/30 text-aura-light-text dark:text-white font-bold opacity-80 hover:opacity-100'
                                    }
                                `}
                            >
                                <span className="text-xs">{item.day}</span>
                                {item.status && (
                                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${item.status === 'Present'
                                        ? (selectedDate === item.date ? 'bg-white' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]')
                                        : (selectedDate === item.date ? 'bg-white' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]')
                                        }`} />
                                )}
                            </motion.button>
                        ) : (
                            <div key={`empty-${index}`} className="aspect-square" />
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Calendar;
