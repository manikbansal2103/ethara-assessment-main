import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
    const [showColdStartMessage, setShowColdStartMessage] = useState(false);

    useEffect(() => {
        if (fullScreen) {
            const timer = setTimeout(() => {
                setShowColdStartMessage(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fullScreen]);

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-aura-light dark:bg-aura-dark z-[100] flex flex-col items-center justify-center">
                <div className="relative">
                    <motion.div
                        className="w-24 h-24 border-4 border-accent-primary-500/10 border-t-accent-primary-500 rounded-full shadow-aura-glow"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary-500 shadow-aura-glow flex items-center justify-center text-white font-black text-xl">A</div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <p className="text-aura-light-text dark:text-white font-black uppercase tracking-[0.4em] text-sm">
                        Synchronizing HRMS
                    </p>
                    <div className="flex justify-center gap-1 mt-3">
                        <motion.div
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-1 rounded-full bg-accent-primary-500"
                        />
                        <motion.div
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-1 h-1 rounded-full bg-accent-primary-500"
                        />
                        <motion.div
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-1 h-1 rounded-full bg-accent-primary-500"
                        />
                    </div>
                </motion.div>
                <AnimatePresence>
                    {showColdStartMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-12 max-w-sm text-center px-6"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-aura-light-muted dark:text-aura-dark-muted opacity-60">
                                INITIALIZING CORE PULSE...
                            </p>
                            <p className="text-[10px] text-aura-light-muted dark:text-aura-dark-muted mt-2 opacity-40">
                                Deployment warm-up may require a moment.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-12">
            <motion.div
                className="w-12 h-12 border-4 border-accent-primary-500/10 border-t-accent-primary-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="w-full animate-pulse space-y-4">
            <div className="bg-neutral-100 dark:bg-aura-dark-surface/50 h-16 rounded-2xl" />
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 aura-glass-light dark:aura-glass-dark rounded-2xl">
                    {[...Array(cols)].map((_, j) => (
                        <div key={j} className="flex-1 h-12 bg-neutral-200 dark:bg-aura-dark-surface rounded-xl opacity-50" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Loader;
