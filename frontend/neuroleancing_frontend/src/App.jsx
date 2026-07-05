import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import BackgroundScene from './components/layout/BackgroundScene';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import PrivateRoute from './components/routing/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Freelancers from './pages/Freelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileCompletion from './pages/ProfileCompletion';
import Messaging from './pages/Messaging';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PostJob from './pages/PostJob';
import MyProjects from './pages/MyProjects';
import AppliedJobs from './pages/AppliedJobs';
import Earnings from './pages/Earnings';

const SIDEBAR_PATHS = ['/dashboard', '/messages', '/settings', '/projects/mine', '/projects/applied', '/earnings'];

const ProfileRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={`/freelancers/${user.id}`} />;
};

const AppLayout = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const showSidebar = user && SIDEBAR_PATHS.some(p => location.pathname.startsWith(p));

    const isSplitPage = ['/', '/about'].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-base)', position: 'relative' }}>
            <BackgroundScene />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <div className="flex flex-1 overflow-hidden">
                    {showSidebar && (
                        <div className="hidden md:flex flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
                        </div>
                    )}
                    <main className={`flex-1 ${isSplitPage ? 'overflow-hidden' : 'overflow-auto'}`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: isSplitPage ? 1 : 0, y: isSplitPage ? 0 : 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: isSplitPage ? 1 : 0, y: isSplitPage ? 0 : -12 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className={isSplitPage ? 'h-full' : 'h-full'}
                            >
                                <Routes location={location}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/projects" element={<Projects />} />
                                    <Route path="/projects/new" element={<PrivateRoute><PostJob /></PrivateRoute>} />
                                    <Route path="/projects/mine" element={<PrivateRoute><MyProjects /></PrivateRoute>} />
                                    <Route path="/projects/applied" element={<PrivateRoute><AppliedJobs /></PrivateRoute>} />
                                    <Route path="/projects/:id" element={<ProjectDetails />} />
                                    <Route path="/freelancers" element={<Freelancers />} />
                                    <Route path="/freelancers/:id" element={<FreelancerProfile />} />
                                    <Route path="/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/complete-profile" element={<PrivateRoute requireComplete={false}><ProfileCompletion /></PrivateRoute>} />
                                    <Route path="/profile" element={<PrivateRoute><ProfileRedirect /></PrivateRoute>} />
                                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                    <Route path="/messages" element={<PrivateRoute><Messaging /></PrivateRoute>} />
                                    <Route path="/messages/:userId" element={<PrivateRoute><Messaging /></PrivateRoute>} />
                                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <DarkModeProvider>
                <AuthProvider>
                    <Router>
                        <AppLayout />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: 'var(--bg-overlay)',
                                    border: '1px solid var(--border-default)',
                                    color: 'var(--text-primary)',
                                    borderRadius: '10px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                },
                                success: { iconTheme: { primary: '#10b981', secondary: 'var(--bg-overlay)' } },
                                error:   { iconTheme: { primary: '#f43f5e', secondary: 'var(--bg-overlay)' } },
                            }}
                        />
                    </Router>
                </AuthProvider>
            </DarkModeProvider>
        </ErrorBoundary>
    );
}

export default App;
