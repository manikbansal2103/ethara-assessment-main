import { motion, AnimatePresence } from 'framer-motion';

const AttendanceTable = ({ records }) => {
    const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3 }
        })
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em]">
                            Chronology
                        </th>
                        <th className="px-8 py-4 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em]">
                            Signal Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence mode="popLayout">
                        {records.map((record, index) => (
                            <motion.tr
                                key={record.id}
                                custom={index}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                className="group aura-glass-light dark:aura-glass-dark hover:bg-neutral-50 dark:hover:bg-aura-dark-surface/30 transition-all duration-500"
                            >
                                <td className="px-8 py-6 rounded-l-[1.5rem]">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-aura-dark-surface flex items-center justify-center text-aura-light-text dark:text-white shadow-aura-glass group-hover:scale-110 transition-transform duration-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-black text-aura-light-text dark:text-white text-base tracking-tight uppercase">
                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted opacity-60 mt-0.5 tracking-widest">
                                                {new Date(record.date).getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 rounded-r-[1.5rem]">
                                    <span className={`inline-flex items-center px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${record.status === 'Present'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                        {record.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
