import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-20 text-center"
        >
            <div className="w-24 h-24 bg-neutral-100 dark:bg-aura-dark-surface rounded-[2rem] flex items-center justify-center text-4xl mb-8 shadow-aura-glass group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-2xl font-display font-black text-aura-light-text dark:text-white mb-4 uppercase tracking-widest">{title}</h3>
            <p className="text-aura-light-muted dark:text-aura-dark-muted max-w-sm mx-auto font-black text-[10px] uppercase tracking-[0.2em] opacity-60">
                {description}
            </p>
        </motion.div>
    );
};

export default EmptyState;
