import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeApi } from '../api/api';
import { getErrorMessage } from '../utils/errorHandler';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import Loader, { TableSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { useToast } from '../components/Toast';

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const { addToast } = useToast();

    // Stats for the header
    const totalEmployees = employees.length;
    const activeDepartments = new Set(employees.map(e => e.department)).size;

    const departments = [
        'All',
        'Engineering',
        'Product',
        'Design',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
    ];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeApi.getAll();
            setEmployees(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (data) => {
        try {
            setFormLoading(true);
            const response = await employeeApi.create(data);
            setEmployees(prev => [...prev, response.data]);
            addToast(`${data.full_name} added successfully!`, 'success');
            setShowAddModal(false);
        } catch (err) {
            const message = getErrorMessage(err);
            addToast(message, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteEmployee = async (employee) => {
        try {
            await employeeApi.delete(employee.id);
            setEmployees(prev => prev.filter(e => e.id !== employee.id));
            addToast(`${employee.full_name} deleted successfully`, 'success');
            setShowDeleteModal(null);
        } catch (err) {
            const message = getErrorMessage(err);
            addToast(message, 'error');
        }
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch =
                emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;

            return matchesSearch && matchesDept;
        });
    }, [employees, searchQuery, selectedDepartment]);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-display font-black text-aura-light-text dark:text-white tracking-tight">Personnel</h1>
                    <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-aura-light-muted dark:text-aura-dark-muted">Total Workforce</span>
                            <span className="text-sm font-black text-accent-primary-500">{totalEmployees}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-aura-light-border dark:bg-aura-dark-border"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-aura-light-muted dark:text-aura-dark-muted">Departments</span>
                            <span className="text-sm font-black text-accent-secondary-500">{activeDepartments}</span>
                        </div>
                    </div>
                </div>
                <motion.button
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="aura-button-primary shadow-aura-glow self-start md:self-auto"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Register Personnel
                </motion.button>
            </div>

            {/* Filters Bar */}
            <div className="aura-card p-3 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-aura-light-muted dark:text-aura-dark-muted group-focus-within:text-accent-primary-500 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search identity or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-12 pr-6 py-4 border-none bg-neutral-100/50 dark:bg-aura-dark-surface/50 rounded-2xl text-aura-light-text dark:text-white placeholder-aura-light-muted/50 dark:placeholder-aura-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-primary-500/20 text-sm font-bold transition-all"
                    />
                </div>

                <div className="w-full md:w-64 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-aura-light-muted dark:text-aura-dark-muted">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="block w-full pl-12 pr-10 py-4 border-none bg-neutral-100/50 dark:bg-aura-dark-surface/50 rounded-2xl text-aura-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary-500/20 text-sm font-bold appearance-none cursor-pointer transition-all"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept} className="bg-white dark:bg-aura-dark-surface text-sm">{dept}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-aura-light-muted dark:text-aura-dark-muted opacity-50">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {/* Main Table View */}
            {loading ? (
                <div className="aura-card p-10">
                    <TableSkeleton rows={6} cols={4} />
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="aura-card p-20 flex flex-col items-center text-center">
                    <EmptyState
                        icon="🔍"
                        title={searchQuery || selectedDepartment !== 'All' ? "Identity Not Found" : "Void Detected"}
                        description={searchQuery || selectedDepartment !== 'All' ? "No personnel match your current filtration parameters." : "The organizational database is currently empty."}
                    />
                </div>
            ) : (
                <div className="aura-card overflow-hidden">
                    <EmployeeTable
                        employees={filteredEmployees}
                        onDelete={(emp) => setShowDeleteModal(emp)}
                    />
                </div>
            )}

            {/* Modals with Aura Glass */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-aura-dark-DEFAULT aura-glass-light dark:aura-glass-dark rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 dark:border-white/5"
                        >
                            <div className="px-10 pt-10 pb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-display font-black text-aura-light-text dark:text-white tracking-tight">Registration</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-primary-500 mt-1">New Personnel Identity</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-aura-dark-surface text-aura-light-muted transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="px-10 pb-10">
                                <EmployeeForm
                                    onSubmit={handleAddEmployee}
                                    onCancel={() => setShowAddModal(false)}
                                    loading={formLoading}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
                        onClick={() => setShowDeleteModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-aura-dark-DEFAULT aura-glass-light dark:aura-glass-dark rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white/20 dark:border-white/5"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-3xl bg-danger/10 flex items-center justify-center text-danger mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-display font-black text-aura-light-text dark:text-white tracking-tight">Purge Identity?</h3>
                                <p className="text-aura-light-muted dark:text-aura-dark-muted mt-4 font-semibold">
                                    Are you certain you wish to terminate the record for <br />
                                    <strong className="text-aura-light-text dark:text-white font-black text-lg block mt-2">"{showDeleteModal.full_name}"</strong>?
                                </p>
                                <p className="text-xs font-black uppercase tracking-widest text-danger mt-6 opacity-60">This transmission cannot be intercepted or reversed</p>
                            </div>

                            <div className="flex flex-col gap-3 mt-10">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDeleteEmployee(showDeleteModal)}
                                    className="w-full py-4 bg-danger text-white font-black rounded-2xl hover:bg-danger/90 transition-all shadow-lg shadow-danger/25 text-sm uppercase tracking-widest"
                                >
                                    Terminate Record
                                </motion.button>
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowDeleteModal(null)}
                                    className="w-full py-4 bg-neutral-100 dark:bg-aura-dark-surface text-aura-light-text dark:text-white font-black rounded-2xl hover:bg-neutral-200 dark:hover:bg-aura-dark-border transition-all text-sm uppercase tracking-widest"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Employees;
