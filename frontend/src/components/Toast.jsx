import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`px-8 py-5 rounded-[2rem] shadow-aura-glow border flex items-center gap-5 min-w-[320px] aura-glass backdrop-blur-2xl ${toast.type === 'success'
                                ? 'border-emerald-500/20'
                                : toast.type === 'error'
                                    ? 'border-rose-500/20'
                                    : 'border-accent-primary-500/20'
                                }`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${toast.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                    toast.type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/30' :
                                        'bg-accent-primary-500 text-white shadow-accent-primary-500/30'
                                    }`}>
                                    {toast.type === 'success' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : toast.type === 'error' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">
                                        {toast.type === 'success' ? 'Confirmation' : toast.type === 'error' ? 'Critical Alert' : 'System Message'}
                                    </p>
                                    <p className="font-bold text-sm text-aura-light-text dark:text-white leading-tight">{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-aura-dark-surface rounded-xl transition-all opacity-40 hover:opacity-100"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
