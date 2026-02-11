import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/Toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import MarkAttendance from './pages/MarkAttendance';

// Mobile Bottom Nav Component
const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 aura-glass aura-glass-light aura-glass-dark border-t border-aura-light-border/40 dark:border-aura-dark-border/40 p-4 flex justify-around items-center z-50 lg:hidden safe-area-bottom">
            <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-accent-primary-500' : 'text-aura-light-muted dark:text-aura-dark-muted'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Dash</span>
            </NavLink>
            <NavLink to="/employees" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-accent-primary-500' : 'text-aura-light-muted dark:text-aura-dark-muted'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Team</span>
            </NavLink>
            <NavLink to="/mark-attendance" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-accent-primary-500' : 'text-aura-light-muted dark:text-aura-dark-muted'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Mark</span>
            </NavLink>
        </div>
    );
};

const MobileHeader = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-40 aura-glass-light dark:aura-glass-dark backdrop-blur-md border-b border-aura-light-border/40 dark:border-aura-dark-border/40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-primary-500 shadow-aura-glow flex items-center justify-center text-white font-bold">A</div>
                <h1 className="font-display font-bold text-lg text-aura-light-text dark:text-aura-dark-text">HRMS Lite</h1>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-full aura-button-secondary">
                {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                )}
            </button>
        </div>
    )
}

function AppContent() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex bg-aura-light dark:bg-aura-dark text-aura-light-text dark:text-aura-dark-text transition-colors duration-500 font-sans selection:bg-accent-primary-500/30">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen lg:ml-72 relative">
                {/* Mobile Header */}
                <MobileHeader />

                {/* Main View Area */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16 pb-28 lg:pb-16 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/employees" element={<Employees />} />
                            <Route path="/mark-attendance" element={<MarkAttendance />} />
                            <Route path="/attendance/:employeeId" element={<Attendance />} />
                        </Routes>
                    </AnimatePresence>
                </main>

                {/* Mobile Bottom Nav */}
                <BottomNav />
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
