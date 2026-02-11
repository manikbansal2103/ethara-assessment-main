import { motion, AnimatePresence } from 'framer-motion';

const ErrorBanner = ({ message, onDismiss }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="aura-glass-light dark:aura-glass-dark border border-rose-500/20 p-6 rounded-[2rem] flex items-center justify-between mb-8 shadow-aura-glass">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest mb-0.5">Anomaly Detected</p>
                                <p className="text-aura-light-text dark:text-white font-bold text-sm tracking-tight">{message}</p>
                            </div>
                        </div>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="p-2 hover:bg-rose-500/10 rounded-xl text-rose-400 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorBanner;
