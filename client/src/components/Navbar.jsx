import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Brain,
    DollarSign,
    Mail,
    Zap,
    Menu,
    X,
    ChevronRight,
    LogIn,
    LogOut,
    UserPlus,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        {
            name: 'Features',
            path: '/features',
            icon: <Sparkles className="h-4 w-4" />
        },
        {
            name: 'Pricing',
            path: '/pricing',
            icon: <DollarSign className="h-4 w-4" />
        },
        {
            name: 'Contact',
            path: '/contact',
            icon: <Mail className="h-4 w-4" />
        },
        {
            name: 'How it works',
            path: '/how-it-works',
            icon: <Zap className="h-4 w-4" />
        },
    ];

    // Check login status whenever route changes (e.g. after login/logout)
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location.pathname]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleConfirmLogout = () => {
        // expire "session" on frontend
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setShowLogoutModal(false);

        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? 'border-b border-slate-800/50 backdrop-blur-xl'
                    : 'bg-slate-950/50 backdrop-blur-md'
                    }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Brand */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3"
                        >
                            <Link to="/" className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-500 rounded-xl blur-lg opacity-60" />
                                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-purple-500">
                                        <Brain className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                                        SupportAI
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        Intelligent Support Platform
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Middle: Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    whileHover={{ y: -2 }}
                                    className="relative"
                                >
                                    <Link
                                        to={link.path}
                                        className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${location.pathname === link.path
                                            ? 'text-sky-400 bg-sky-500/10'
                                            : 'text-slate-300 hover:text-sky-400 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <span className="opacity-70 group-hover:opacity-100">
                                            {link.icon}
                                        </span>
                                        {link.name}
                                        {location.pathname === link.path && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full"
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">

                            {/* Login Button */}

                            {/* Login / Logout toggle button */}
                            {!isLoggedIn ? (
                                // SHOW LOGIN when user is not logged in (guest)
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        to="/login"
                                        className="group flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Login
                                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </motion.div>
                            ) : (
                                // SHOW LOGOUT when user is logged in
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <button
                                        type="button"
                                        onClick={handleLogoutClick}
                                        className="group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-red-100 hover:border-red-400 hover:bg-red-900/40 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </motion.div>
                            )}

                            <motion.div whileHover={{ scale: 1.07 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Link
                                    to="/signup"
                                    className="
      group relative inline-flex items-center justify-center
      overflow-hidden rounded-xl 
      bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
      px-6 py-2.5 
      text-sm font-semibold text-white
      shadow-md shadow-sky-500/30
      hover:shadow-lg hover:shadow-purple-500/40
      transition-all duration-300
    "
                                >
                                    <span className="relative flex items-center gap-2">
                                        <UserPlus className="h-4 w-4 text-white/90" />
                                        Sign Up
                                        <ChevronRight
                                            className="
          h-3 w-3 
          transition-all duration-300 
          group-hover:translate-x-1 
          group-hover:text-white
        "
                                        />
                                    </span>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50 md:hidden"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed right-0 top-0 z-50 h-full w-80 bg-slate-950 border-l border-slate-800 md:hidden"
                        >
                            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-purple-500">
                                        <Brain className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-white">SupportAI</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg p-2 hover:bg-slate-800"
                                >
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={handleNavClick}
                                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname === link.path
                                                ? 'bg-sky-500/10 text-sky-400'
                                                : 'text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className="opacity-70">
                                                {link.icon}
                                            </span>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-8 space-y-4">
                                    <Link
                                        to="/login"
                                        onClick={handleNavClick}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={handleNavClick}
                                        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Sign Up
                                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                                    <p className="text-xs font-medium text-slate-400 mb-2">
                                        Try SupportAI for free
                                    </p>
                                    <p className="text-sm text-slate-300">
                                        Start your 14-day trial. No credit card required.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {showLogoutModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-xl bg-slate-900 p-5 shadow-lg border border-slate-700">
                        <h2 className="mb-2 text-lg font-semibold text-slate-100">
                            Logout confirmation
                        </h2>
                        <p className="mb-4 text-sm text-slate-300">
                            Are you sure you want to logout? Your account will not be deleted, only
                            your current session will end.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelLogout}
                                className="rounded-lg border border-slate-600 px-4 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Navbar;