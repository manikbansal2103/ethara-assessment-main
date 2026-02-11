import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeApi, attendanceApi } from '../api/api';
import { getErrorMessage } from '../utils/errorHandler';
import Calendar from '../components/Calendar';
import AttendanceTable from '../components/AttendanceTable';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useToast } from '../components/Toast';

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

const Attendance = () => {
    const { employeeId } = useParams();
    const today = new Date().toISOString().split('T')[0];
    const [employee, setEmployee] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedDate, setSelectedDate] = useState(today);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchData();
    }, [employeeId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [empResponse, attResponse] = await Promise.all([
                employeeApi.getById(employeeId),
                attendanceApi.getByEmployee(employeeId)
            ]);

            setEmployee(empResponse.data);
            setRecords(attResponse.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to load attendance data'));
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (status) => {
        try {
            setActionLoading(status);
            const response = await attendanceApi.mark({
                employee_id: employeeId,
                date: selectedDate,
                status: status
            });

            // Update records: remove existing if any, add new
            setRecords(prev => {
                const filtered = prev.filter(r => r.date !== selectedDate);
                return [response.data, ...filtered];
            });

            addToast(`Marked ${status} for ${selectedDate}`, 'success');
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to mark attendance');
            addToast(message, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const selectedRecord = records.find(r => r.date === selectedDate);
    const isFutureDate = selectedDate > today;

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end gap-8 pb-4 border-b border-aura-light-border/40 dark:border-aura-dark-border/40">
                <Link to="/employees">
                    <motion.button
                        whileHover={{ scale: 1.1, x: -4 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 rounded-2xl aura-glass shadow-aura-glass text-aura-light-muted dark:text-aura-dark-muted transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                </Link>
                <div>
                    <h1 className="text-5xl font-display font-black tracking-tight text-aura-light-text dark:text-white leading-none">
                        Attendance Log
                    </h1>
                    {employee && (
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-8 h-8 rounded-xl bg-accent-primary-500 shadow-aura-glow flex items-center justify-center text-white font-black text-[10px]">
                                {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-aura-light-muted dark:text-aura-dark-muted text-sm font-black uppercase tracking-[0.2em]">
                                {employee.full_name} • <span className="opacity-40">{employee.employee_id}</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Calendar & Actions Panel */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="aura-glass-light dark:aura-glass-dark rounded-[2.5rem] p-10 border border-aura-light-border/40 dark:border-aura-dark-border/20 shadow-2xl">
                        <Calendar
                            records={records}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />
                    </div>

                    <div className="aura-glass-light dark:aura-glass-dark rounded-[2.5rem] p-10 border border-aura-light-border/40 dark:border-aura-dark-border/20 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-aura-light-text dark:text-white uppercase tracking-[0.2em]">
                                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </h3>
                            {selectedRecord && (
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedRecord.status === 'Present'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    }`}>
                                    {selectedRecord.status}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        {isFutureDate ? (
                            <div className="p-8 rounded-[1.5rem] bg-neutral-100/50 dark:bg-aura-dark-surface/50 text-center">
                                <p className="text-aura-light-muted dark:text-aura-dark-muted text-xs font-black uppercase tracking-widest opacity-40">Timeline unavailable</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-aura-light-muted dark:text-aura-dark-muted mb-4 uppercase tracking-[0.2em] opacity-60">Update Attendance:</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleMarkAttendance('Present')}
                                        disabled={actionLoading}
                                        className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 ${selectedRecord?.status === 'Present'
                                            ? 'bg-emerald-500 text-white shadow-aura-glow ring-4 ring-emerald-500/20'
                                            : 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500 hover:text-white'
                                            }`}
                                    >
                                        {actionLoading === 'Present' ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        )}
                                        Present
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleMarkAttendance('Absent')}
                                        disabled={actionLoading}
                                        className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 ${selectedRecord?.status === 'Absent'
                                            ? 'bg-rose-500 text-white shadow-aura-glow ring-4 ring-rose-500/20'
                                            : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border border-rose-500/10 hover:bg-rose-500 hover:text-white'
                                            }`}
                                    >
                                        {actionLoading === 'Absent' ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        )}
                                        Absent
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="lg:col-span-7 aura-glass-light dark:aura-glass-dark rounded-[2.5rem] p-10 border border-aura-light-border/40 dark:border-aura-dark-border/20 shadow-2xl">
                    <h2 className="text-xl font-display font-black text-aura-light-text dark:text-white mb-10 uppercase tracking-widest">Attendance History</h2>
                    {records.length === 0 ? (
                        <div className="py-20">
                            <EmptyState
                                icon="📅"
                                title="No records detected"
                                description="Transmission history will manifest here."
                            />
                        </div>
                    ) : (
                        <AttendanceTable records={records} />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Attendance;
