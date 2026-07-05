import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
    open,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}) => {
    const confirmStyle = variant === 'danger'
        ? 'btn-danger px-5 py-2.5 rounded-xl text-sm font-bold'
        : 'btn-primary px-5 py-2.5 rounded-xl text-sm font-bold text-white';

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        className="modal-card max-w-sm p-6"
                        initial={{ scale: 0.92, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.92, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: variant === 'danger' ? 'rgba(244,63,94,0.15)' : 'rgba(14,165,233,0.15)' }}>
                                <AlertTriangle className="h-5 w-5" style={{ color: variant === 'danger' ? '#fb7185' : '#38bdf8' }} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-loud)' }}>{title}</h3>
                                {message && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium"
                                onClick={onCancel}
                            >
                                {cancelLabel}
                            </button>
                            <button className={confirmStyle} onClick={onConfirm}>
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
