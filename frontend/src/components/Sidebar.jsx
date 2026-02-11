import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon, label, exact = false }) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) =>
                `relative flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-500 group ${isActive
                    ? 'text-aura-light-text dark:text-white font-bold'
                    : 'text-aura-light-muted dark:text-aura-dark-muted hover:text-aura-light-text dark:hover:text-slate-200'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-white/40 dark:bg-accent-primary-500/10 aura-glass-light dark:border-accent-primary-500/20 shadow-aura-glow rounded-3xl"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        />
                    )}
                    <span className={`relative z-10 text-xl group-hover:scale-110 transition-transform duration-300 ${isActive ? 'text-accent-primary-500' : ''}`}>
                        {icon}
                    </span>
                    <span className="relative z-10 text-sm font-semibold tracking-tight">{label}</span>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent-primary-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-screen w-72 p-8 z-50 hidden lg:flex flex-col gap-10"
        >
            {/* Logo Area */}
            <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-2xl bg-accent-primary-500 shadow-aura-glow flex items-center justify-center text-white font-bold text-2xl">
                    A
                </div>
                <div>
                    <h1 className="font-display font-extrabold text-2xl text-aura-light-text dark:text-white tracking-tighter leading-none">
                        HRMS Lite
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted font-black opacity-60">
                            Enterprise
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-3">
                <NavItem
                    to="/dashboard"
                    label="Dashboard"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    }
                />
                <NavItem
                    to="/employees"
                    label="Team Members"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />
                <NavItem
                    to="/mark-attendance"
                    label="Attendance"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </nav>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-aura-light-border dark:border-aura-dark-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-aura-dark-surface border border-aura-light-border dark:border-aura-dark-border flex items-center justify-center text-xs font-black text-aura-light-text dark:text-white">
                        AD
                    </div>
                    <div>
                        <p className="font-bold text-sm text-aura-light-text dark:text-white">Admin</p>
                        <p className="text-[10px] text-accent-primary-500 font-bold uppercase tracking-wider">Online</p>
                    </div>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl aura-glass aura-glass-light dark:aura-glass-dark text-aura-light-muted dark:text-accent-primary-400 hover:text-accent-primary-500 transition-colors shadow-sm"
                >
                    {theme === 'light' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
