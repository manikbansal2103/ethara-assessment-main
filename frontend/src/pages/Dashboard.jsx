import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { employeeApi, attendanceApi } from '../api/api';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, empRes] = await Promise.all([
                attendanceApi.getStats(),
                employeeApi.getAll()
            ]);
            setStats(statsRes.data);
            setEmployees(empRes.data);

            const activityPromises = empRes.data.slice(0, 5).map(async (emp) => {
                try {
                    const attRes = await attendanceApi.getByEmployee(emp.employee_id);
                    if (attRes.data.length > 0) {
                        return { ...attRes.data[0], employee: emp };
                    }
                    return null;
                } catch { return null; }
            });
            const activities = (await Promise.all(activityPromises)).filter(Boolean);
            setRecentActivity(activities.slice(0, 5));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const departmentCounts = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {});

    const recentEmployees = [...employees].sort((a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    ).slice(0, 5);

    if (loading) return <Loader fullScreen />;

    // Elegant, functional color palette for stats
    const statCards = [
        {
            title: 'Total Force',
            value: stats?.total_employees || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            accentColor: 'text-accent-primary-500',
            glowColor: 'bg-accent-primary-500/10'
        },
        {
            title: 'Present Now',
            value: stats?.present_today || 0,
            subtitle: today,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            accentColor: 'text-success',
            glowColor: 'bg-success/10'
        },
        {
            title: 'Absentees',
            value: stats?.absent_today || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            accentColor: 'text-danger',
            glowColor: 'bg-danger/10'
        },
        {
            title: 'Pending',
            value: stats?.not_marked || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            accentColor: 'text-warning',
            glowColor: 'bg-warning/10'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="space-y-12">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-display font-black text-aura-light-text dark:text-white tracking-tight">Dashboard</h2>
                    <p className="text-aura-light-muted dark:text-aura-dark-muted mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-primary-500 animate-pulse"></span>
                        Real-time organizational insights
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/mark-attendance" className="aura-button-primary shadow-aura-glow">
                        Mark Attendance
                    </Link>
                    <Link to="/employees" className="aura-button-secondary">
                        Manage Team
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card) => (
                    <motion.div
                        key={card.title}
                        variants={itemVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="aura-card group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${card.glowColor} blur-[50px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl aura-glass aura-glass-light dark:aura-glass-dark ${card.accentColor}`}>
                                    {card.icon}
                                </div>
                                {card.value > 0 && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary-500/60 leading-none mb-1">Active</span>
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent-primary-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary-500"></span>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted opacity-60 mb-1">{card.title}</p>
                                <h3 className="text-5xl font-display font-black text-aura-light-text dark:text-white tracking-tighter">{card.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-2 aura-card"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-display font-black text-aura-light-text dark:text-white">Recent Activity</h3>
                        <Link to="/mark-attendance" className="text-sm font-black uppercase tracking-widest text-accent-primary-500 hover:text-accent-primary-600 transition-colors">History</Link>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-aura-light-border dark:border-aura-dark-border rounded-[2rem]">
                                <p className="text-aura-light-muted dark:text-aura-dark-muted font-medium italic">No recent attendance recorded</p>
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <motion.div
                                    key={`${activity.employee_id}-${activity.date}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                    className="flex items-center justify-between p-6 rounded-[1.5rem] bg-neutral-100/50 dark:bg-aura-dark-surface/50 hover:bg-white dark:hover:bg-aura-dark-surface transition-all duration-300 border border-transparent hover:border-aura-light-border dark:hover:border-aura-dark-border group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl aura-glass aura-glass-light dark:aura-glass-dark dark:bg-accent-primary-500/10 flex items-center justify-center text-accent-primary-500 font-black text-lg shadow-sm">
                                            {activity.employee?.full_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-aura-light-text dark:text-white font-black text-sm group-hover:text-accent-primary-500 transition-colors">{activity.employee?.full_name}</p>
                                            <p className="text-xs text-aura-light-muted dark:text-aura-dark-muted font-semibold mt-0.5 uppercase tracking-wider">{activity.date}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-500 ${activity.status === 'Present'
                                        ? 'bg-success/10 text-success border-success/20 dark:bg-success/5'
                                        : 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/5'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Departments */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="aura-card"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-8 bg-accent-secondary-500 rounded-full"></div>
                        <h3 className="text-2xl font-display font-black text-aura-light-text dark:text-white">Departments</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(departmentCounts).length === 0 ? (
                            <div className="text-center py-10"><p className="text-aura-light-muted font-medium italic">No departments found</p></div>
                        ) : (
                            Object.entries(departmentCounts).map(([dept, count], index) => (
                                <motion.div
                                    key={dept}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-aura-dark-surface/50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-accent-primary-500 group-hover:scale-[3] transition-transform duration-500"></div>
                                        <span className="text-aura-light-text dark:text-aura-dark-muted font-bold text-sm tracking-tight group-hover:text-aura-light-text dark:group-hover:text-white transition-colors">{dept}</span>
                                    </div>
                                    <span className="text-[10px] font-black bg-neutral-200/50 dark:bg-aura-dark-border/50 text-aura-light-text dark:text-white px-3 py-1 rounded-lg">
                                        {count}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
