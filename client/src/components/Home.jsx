import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Zap,
    Brain,
    MessageSquare,
    Users,
    Shield,
    ChevronRight,
    ExternalLink,
    BarChart3,
    Send,
    Clock,
    CheckCircle,
    Sparkle,
    Bot,
    User,
    Settings,
    Mail,
    AlertCircle,
    FileText,
    Search,
    Filter,
    Menu,
    X
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Custom utilities for class merging
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredFeature, setHoveredFeature] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Brain,
            title: 'AI Ticket Intelligence',
            description: 'Automated classification, summarization, and priority scoring using GPT-4.',
            gradient: 'from-sky-500 to-cyan-500',
        },
        {
            icon: MessageSquare,
            title: 'Smart Reply Assistant',
            description: 'Context-aware response suggestions that learn from your team\'s style.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Users,
            title: 'Collaborative Inbox',
            description: 'Real-time team collaboration with mentions and internal notes.',
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            icon: BarChart3,
            title: 'Live Analytics',
            description: 'Real-time dashboard with customer sentiment and team performance.',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'SOC2 compliant with end-to-end encryption and audit logs.',
            gradient: 'from-violet-500 to-indigo-500',
        },
        {
            icon: Zap,
            title: 'Automated Workflows',
            description: 'Create custom rules for routing, escalation, and resolution.',
            gradient: 'from-rose-500 to-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-x-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute top-60 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="absolute -bottom-40 left-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-24">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-12 lg:grid-cols-2 lg:items-center"
                >
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2"
                        >
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-sky-300">
                                Live AI-powered support platform
                            </span>
                        </motion.div>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Transform customer
                            <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                                support with AI <br /> Tech and Tools
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-slate-300">
                            NovaDesk combines cutting-edge AI with human-centered design to help your team
                            resolve tickets faster, reduce response times, and keep customers delighted.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/25"
                            >
                                <span className="relative flex items-center gap-2">
                                    Start 14-day Free Trial
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
                            >
                                <span className="flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    View Live Demo
                                </span>
                            </motion.button>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-8 w-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-sky-500 to-purple-500"
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-slate-400">
                                    <span className="font-semibold text-white">250+ teams</span> trust NovaDesk
                                </div>
                            </div>

                            <div className="hidden items-center gap-4 md:flex">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                                    <span className="text-sm text-slate-300">99.9% Uptime</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-sky-400" />
                                    <span className="text-sm text-slate-300">Enterprise Security</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Dashboard Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 to-purple-500/20 blur-3xl" />
                        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Live Ticket Dashboard</h3>
                                    <p className="text-sm text-slate-400">Real-time AI insights</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-emerald-500/20 px-3 py-1">
                                        <span className="text-xs font-semibold text-emerald-300">12 Active</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center">
                                        <Settings className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {[
                                    {
                                        title: "Payment failed but amount deducted",
                                        priority: "urgent",
                                        category: "Billing",
                                        time: "2 min ago",
                                        agent: "Sarah",
                                        status: "new"
                                    },
                                    {
                                        title: "App crashes on iOS 17",
                                        priority: "high",
                                        category: "Technical",
                                        time: "5 min ago",
                                        agent: "Mike",
                                        status: "in-progress"
                                    },
                                    {
                                        title: "Need invoice for Q4 2024",
                                        priority: "medium",
                                        category: "Billing",
                                        time: "15 min ago",
                                        agent: null,
                                        status: "unassigned"
                                    },
                                ].map((ticket, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-2 w-2 rounded-full ${ticket.priority === 'urgent' ? 'bg-rose-500' :
                                                            ticket.priority === 'high' ? 'bg-orange-500' : 'bg-amber-500'
                                                        }`} />
                                                    <h4 className="text-sm font-medium text-white">{ticket.title}</h4>
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                                    <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs text-sky-300">
                                                        {ticket.category}
                                                    </span>
                                                    <span className={`rounded-full px-3 py-1 text-xs ${ticket.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' :
                                                            ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-300' : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {ticket.priority} priority
                                                    </span>
                                                    <span className="text-xs text-slate-500">{ticket.time}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {ticket.agent ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500" />
                                                        <span className="text-xs text-slate-300">{ticket.agent}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Unassigned</span>
                                                )}
                                                <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-sky-500 hover:text-sky-300">
                                                    Take
                                                </button>
                                            </div>
                                        </div>

                                        {/* AI Summary */}
                                        <div className="mt-3 rounded-lg bg-slate-950/60 p-3">
                                            <div className="flex items-center gap-2">
                                                <Bot className="h-4 w-4 text-sky-400" />
                                                <span className="text-xs font-medium text-slate-200">AI Summary</span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Customer facing payment gateway issue. Amount deducted but order not confirmed.
                                                Check transaction ID #TRX-7842 with payment provider.
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* AI Response Generator */}
                            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                                <div className="flex items-center gap-3">
                                    <Brain className="h-5 w-5 text-purple-400" />
                                    <div>
                                        <p className="text-sm font-medium text-white">AI Suggested Reply</p>
                                        <p className="text-xs text-slate-400">Draft generated from similar resolved tickets</p>
                                    </div>
                                </div>
                                <div className="mt-3 rounded-lg bg-slate-900/50 p-3">
                                    <p className="text-sm text-slate-300">
                                        "Hi there, I understand the concern about the payment. I've checked and can see the transaction
                                        is pending verification. I'll escalate this to our payments team and update you within 15 minutes."
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center justify-end gap-2">
                                    <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500">
                                        Regenerate
                                    </button>
                                    <button className="rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-3 py-1.5 text-xs font-medium text-white">
                                        Use This
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Features Grid */}
                <section>
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2"
                        >
                            <Sparkle className="h-4 w-4 text-sky-400" />
                            <span className="text-sm font-medium text-slate-300">Why Choose NovaDesk</span>
                        </motion.div>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything you need for
                            <span className="block bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                                modern customer support
                            </span>
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                onMouseEnter={() => setHoveredFeature(index)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:border-slate-700"
                            >
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity`} />
                                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                                <motion.div
                                    className="mt-4 flex items-center gap-2 text-sm font-medium text-sky-400"
                                    animate={hoveredFeature === index ? { x: 4 } : { x: 0 }}
                                >
                                    <span>Learn more</span>
                                    <ChevronRight className="h-4 w-4" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-xl"
                >
                    <div className="grid gap-8 md:grid-cols-4">
                        {[
                            { value: '4.8s', label: 'Avg. first response time', icon: Clock },
                            { value: '94%', label: 'Customer satisfaction', icon: CheckCircle },
                            { value: '40%', label: 'Time saved with AI', icon: Zap },
                            { value: '10K+', label: 'Tickets processed daily', icon: Send },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <stat.icon className="mx-auto h-8 w-8 text-sky-400" />
                                <div className="mt-4 text-3xl font-bold text-white">{stat.value}</div>
                                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-12 backdrop-blur-xl">
                        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

                        <div className="relative">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Ready to transform your
                                <span className="block bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                                    customer support?
                                </span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                                Join thousands of teams using NovaDesk to deliver exceptional customer experiences.
                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/25"
                                >
                                    <span className="relative flex items-center gap-2">
                                        Start Free 14-day Trial
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
                                >
                                    Schedule a Demo
                                </motion.button>
                            </div>

                            <p className="mt-4 text-sm text-slate-500">
                                No credit card required • Free onboarding • 24/7 support
                            </p>
                        </div>
                    </div>
                </motion.section>
            </main>

        </div>
    );
}

export default Home;