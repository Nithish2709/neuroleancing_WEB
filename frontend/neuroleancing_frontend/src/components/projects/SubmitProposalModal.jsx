import React, { useState, useEffect } from 'react';
import { X, Send, DollarSign, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '../../i18n';
import { submitProposal } from '../../api';

const SubmitProposalModal = ({ isOpen, onClose, projectId, onProposalSubmitted }) => {
    const [formData, setFormData] = useState({ coverLetter: '', bidAmount: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            setFormData({ coverLetter: '', bidAmount: '' });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await submitProposal(projectId, formData);
            setSuccess(true);
            toast.success('Proposal submitted successfully!');
            onProposalSubmitted(data);
            setTimeout(() => onClose(), 1800);
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const inputStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        borderRadius: '10px',
        fontSize: '0.875rem',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const onFocus = (e) => { e.target.style.borderColor = 'var(--sky)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.18)'; };
    const onBlur  = (e) => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(5,10,14,0.85)', backdropFilter: 'blur(8px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-md overflow-hidden"
                        style={{
                            background: 'var(--bg-overlay)',
                            borderRadius: '16px',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 4px 16px var(--sky-glow)',
                            border: '1px solid var(--border-default)',
                        }}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        {/* Header stripe */}
                        <div style={{ background: 'var(--grad-sky)', height: '3px' }} />

                        <div className="px-6 pt-5 pb-6">
                            {/* Title row */}
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'var(--grad-sky)', boxShadow: '0 0 12px var(--sky-glow)' }}>
                                        <Send className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Submit Proposal</h3>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fill in your bid details below</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Success state */}
                            {success ? (
                                <motion.div
                                    className="py-10 flex flex-col items-center gap-4"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="relative">
                                        <motion.div
                                            className="absolute inset-0 rounded-full"
                                            style={{ border: '2px solid var(--sky)' }}
                                            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        />
                                        <div className="h-20 w-20 rounded-full flex items-center justify-center"
                                            style={{ background: 'var(--grad-sky)', boxShadow: '0 0 30px var(--sky-glow)' }}>
                                            <svg viewBox="0 0 40 40" className="h-10 w-10">
                                                <polyline points="8,20 17,29 32,12" fill="none" stroke="white"
                                                    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Proposal Sent!</p>
                                    <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                                        Your proposal has been submitted. The client will review it shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Bid Amount */}
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                            <DollarSign className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                                            {t('label.bidAmount')}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                                            <input
                                                type="number"
                                                name="bidAmount"
                                                required
                                                min="1"
                                                value={formData.bidAmount}
                                                onChange={handleChange}
                                                placeholder="e.g. 500"
                                                style={{ ...inputStyle, padding: '10px 14px 10px 28px' }}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Cover Letter */}
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                            <FileText className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                                            {t('label.coverLetter')}
                                        </label>
                                        <textarea
                                            name="coverLetter"
                                            required
                                            rows="5"
                                            value={formData.coverLetter}
                                            onChange={handleChange}
                                            placeholder="Describe why you are the best fit for this project..."
                                            style={{ ...inputStyle, padding: '10px 14px', resize: 'none' }}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                        />
                                        <p className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formData.coverLetter.length} chars</p>
                                    </motion.div>

                                    {/* Buttons */}
                                    <motion.div
                                        className="flex gap-3 pt-1"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.24 }}
                                    >
                                        <button type="button" onClick={onClose}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-medium btn-secondary">
                                            Cancel
                                        </button>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                                            whileHover={{ scale: loading ? 1 : 1.02 }}
                                            whileTap={{ scale: loading ? 1 : 0.97 }}
                                        >
                                            {loading ? (
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <><Send className="h-4 w-4" />Submit Proposal</>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubmitProposalModal;
