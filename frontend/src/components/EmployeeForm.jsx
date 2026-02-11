import { useState } from 'react';
import { motion } from 'framer-motion';

const EmployeeForm = ({ onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [errors, setErrors] = useState({});

    const departments = [
        'Engineering',
        'Product',
        'Design',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.employee_id.trim()) {
            newErrors.employee_id = 'Employee ID is required';
        }
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
            setFormData({
                employee_id: '',
                full_name: '',
                email: '',
                department: '',
            });
            setErrors({});
        } catch (error) {
            // Error handled by parent
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const inputClasses = (error) => `
        w-full px-6 py-4 rounded-2xl border bg-neutral-100/50 dark:bg-aura-dark-surface/50
        ${error
            ? 'border-danger bg-danger/5 dark:bg-danger/10'
            : 'border-transparent focus:bg-white dark:focus:bg-aura-dark-surface focus:ring-2 focus:ring-accent-primary-500/20'
        }
        text-aura-light-text dark:text-white placeholder-aura-light-muted/40 dark:placeholder-aura-dark-muted/40
        focus:outline-none transition-all duration-500 font-bold text-sm
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee ID */}
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted mb-3 ml-1">
                        Access Key / ID
                    </label>
                    <input
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        placeholder="ID-0000"
                        className={inputClasses(errors.employee_id)}
                    />
                    {errors.employee_id && (
                        <p className="text-danger text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <span className="w-1 h-1 rounded-full bg-danger"></span>
                            {errors.employee_id}
                        </p>
                    )}
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted mb-3 ml-1">
                        Full Identity
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClasses(errors.full_name)}
                    />
                    {errors.full_name && (
                        <p className="text-danger text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <span className="w-1 h-1 rounded-full bg-danger"></span>
                            {errors.full_name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted mb-3 ml-1">
                        Communication Link
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="identity@aura.io"
                        className={inputClasses(errors.email)}
                    />
                    {errors.email && (
                        <p className="text-danger text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <span className="w-1 h-1 rounded-full bg-danger"></span>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Department */}
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-aura-light-muted dark:text-aura-dark-muted mb-3 ml-1">
                        Assigned Cluster
                    </label>
                    <div className="relative">
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`${inputClasses(errors.department)} appearance-none cursor-pointer pr-12`}
                        >
                            <option value="" className="bg-white dark:bg-aura-dark-surface">Select department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} className="bg-white dark:bg-aura-dark-surface">{dept}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-aura-light-muted dark:text-aura-dark-muted opacity-40">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                    {errors.department && (
                        <p className="text-danger text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <span className="w-1 h-1 rounded-full bg-danger"></span>
                            {errors.department}
                        </p>
                    )}
                </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4">
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 aura-button-primary py-4 text-sm shadow-aura-glow"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Initiate Registration</span>
                        </>
                    )}
                </motion.button>
                {onCancel && (
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onCancel}
                        className="flex-1 aura-button-secondary py-4 text-sm"
                    >
                        Dispose
                    </motion.button>
                )}
            </div>
        </form>
    );
};

export default EmployeeForm;
