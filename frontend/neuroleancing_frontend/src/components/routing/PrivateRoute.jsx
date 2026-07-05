import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, requireComplete = true }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{ background: 'var(--bg-base)' }}
        >
            <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: 'rgba(14,165,233,0.2)' }} />
                <div className="absolute inset-0 rounded-full border-t-2 animate-spin"
                    style={{ borderColor: 'transparent', borderTopColor: '#0ea5e9' }} />
                <div className="absolute inset-2 rounded-full border-t-2 animate-spin"
                    style={{ borderColor: 'transparent', borderTopColor: '#10b981', animationDuration: '1.5s', animationDirection: 'reverse' }} />
            </div>
            <span className="text-grad-sky text-lg font-bold tracking-wider">Neurolance</span>
            <span className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Loading your workspace...</span>
        </div>
    );

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    if (requireComplete && !user.profileComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};

export default PrivateRoute;
