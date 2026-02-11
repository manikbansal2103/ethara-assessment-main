import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ employees, onDelete, loading = false }) => {
    const tableRowVariants = {
        hidden: { opacity: 0, scale: 0.98, y: 10 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: i * 0.04,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }),
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
    };

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-0 min-w-[700px]">
                <thead>
                    <tr className="bg-neutral-50 dark:bg-aura-dark-surface/30">
                        <th className="px-8 py-5 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em] rounded-tl-2xl">
                            Identity
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em] hidden md:table-cell">
                            Transmission
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em]">
                            Cluster
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-[0.2em] text-right rounded-tr-2xl pr-10">
                            Protocol
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-aura-light-border dark:divide-aura-dark-border">
                    <AnimatePresence mode="popLayout">
                        {employees.map((employee, index) => (
                            <motion.tr
                                key={employee.id}
                                custom={index}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                className="group hover:bg-neutral-50/80 dark:hover:bg-aura-dark-surface/50 transition-all duration-500"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-[1.25rem] aura-glass aura-glass-light dark:aura-glass-dark dark:bg-accent-primary-500/10 flex items-center justify-center text-accent-primary-500 font-black text-lg shadow-sm group-hover:scale-110 transition-transform duration-500">
                                            {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-display font-black text-aura-light-text dark:text-white text-base tracking-tight group-hover:text-accent-primary-500 transition-colors">{employee.full_name}</p>
                                            <p className="text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted uppercase tracking-wider mt-0.5 opacity-60">
                                                ID: <span className="text-accent-primary-500">{employee.employee_id}</span>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 hidden md:table-cell">
                                    <span className="text-sm font-bold text-aura-light-muted dark:text-aura-dark-muted group-hover:text-aura-light-text dark:group-hover:text-slate-200 transition-colors uppercase tracking-tight">{employee.email}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-accent-primary-500/5 text-accent-primary-500 border border-accent-primary-500/10 dark:bg-accent-primary-500/10">
                                        {employee.department}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right pr-10">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <Link to={`/attendance/${employee.employee_id}`}>
                                            <motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-3 rounded-2xl aura-glass aura-glass-light dark:aura-glass-dark text-aura-light-muted dark:text-accent-primary-400 hover:text-accent-primary-500 transition-colors shadow-sm"
                                                title="View Transmissions"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onDelete(employee)}
                                            disabled={loading}
                                            className="p-3 rounded-2xl aura-glass aura-glass-light dark:aura-glass-dark text-aura-light-muted dark:text-danger hover:text-danger transition-colors shadow-sm"
                                            title="Purge Identity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
