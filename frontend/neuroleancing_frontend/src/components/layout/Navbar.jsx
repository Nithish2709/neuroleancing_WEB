import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Home, Briefcase, Users, LayoutDashboard, LogOut, LogIn, UserPlus, Sun, Moon, Info, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { dark, toggle } = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };
    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setIsOpen(false)}
            className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(to) ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/6'
            }`}
        >
            <Icon className="h-4 w-4" />{label}
            {isActive(to) && (
                <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(14,165,233,0.18)', border: '1px solid rgba(14,165,233,0.35)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
            )}
        </Link>
    );

    return (
        <>
            <motion.nav
                className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'nav-gradient'}`}
                initial={{ y: -64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                            <motion.div
                                className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                                style={{ background: 'var(--grad-sky)', boxShadow: '0 0 14px var(--sky-glow)' }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                N
                            </motion.div>
                            <span className="hidden sm:block font-bold text-lg gradient-text">Neurolance</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1 relative">
                            <NavLink to="/" icon={Home} label="Home" />
                            <NavLink to="/about" icon={Info} label="About" />
                            <NavLink to="/contact" icon={Mail} label="Contact" />
                            {(user?.role === 'client' || !user) && <NavLink to="/freelancers" icon={Users} label="Hire Talent" />}
                            {(user?.role === 'freelancer' || !user) && <NavLink to="/projects" icon={Briefcase} label="Find Work" />}
                            {user && <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />}
                        </div>

                        {/* Desktop Right */}
                        <div className="hidden md:flex items-center gap-2">
                            <motion.button
                                onClick={toggle}
                                aria-label="Toggle dark mode"
                                className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.04)' }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={dark ? 'sun' : 'moon'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>

                            {user ? (
                                <>
                                    <NotificationBell />
                                    <span className="text-xs px-2.5 py-1 rounded-full capitalize badge-blue font-medium">
                                        {user.role}
                                    </span>
                                    <motion.div
                                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
                                        style={{ background: 'var(--grad-sky)', boxShadow: '0 0 10px var(--sky-glow)' }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {user.name?.charAt(0).toUpperCase()}
                                    </motion.div>
                                    <motion.button
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                                        style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}
                                        whileHover={{ scale: 1.03, background: 'rgba(239,68,68,0.18)' }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <LogOut className="h-4 w-4" />Logout
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"
                                        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                        <LogIn className="h-4 w-4" />Log in
                                    </Link>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Link to="/register"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg btn-primary">
                                            <UserPlus className="h-4 w-4" />Sign up
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </div>

                        {/* Mobile right */}
                        <div className="md:hidden flex items-center gap-2">
                            <button onClick={toggle} className="p-2 rounded-lg text-slate-400">
                                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            {user && <NotificationBell />}
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isOpen ? 'x' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile full-screen overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 md:hidden flex flex-col pt-16"
                        style={{ background: 'rgba(5,10,14,0.97)', backdropFilter: 'blur(20px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 py-6 space-y-1 flex-1">
                            {[
                                { to: '/', icon: Home, label: 'Home' },
                                { to: '/about', icon: Info, label: 'About' },
                                { to: '/contact', icon: Mail, label: 'Contact' },
                                ...(user?.role === 'client' || !user ? [{ to: '/freelancers', icon: Users, label: 'Hire Talent' }] : []),
                                ...(user?.role === 'freelancer' || !user ? [{ to: '/projects', icon: Briefcase, label: 'Find Work' }] : []),
                                ...(user ? [{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }] : []),
                            ].map(({ to, icon: Icon, label }, i) => (
                                <motion.div
                                    key={to}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link to={to} onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                                            isActive(to)
                                                ? 'text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                        style={isActive(to) ? { background: 'rgba(14,165,233,0.15)', borderLeft: '3px solid var(--sky)' } : {}}>
                                        <Icon className="h-5 w-5" />{label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="px-6 py-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            {user ? (
                                <button onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400">
                                    <LogOut className="h-5 w-5" />Logout
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300"
                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <LogIn className="h-5 w-5" />Log in
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white btn-primary">
                                        <UserPlus className="h-5 w-5" />Sign up free
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
