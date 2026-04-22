import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileUp,
  Gauge,
  Home,
  KeyRound,
  LogOut,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCircle2,
} from "lucide-react";
import { api } from "./lib/api";

const pageVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const glowCard =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300";

const TopNav = ({ isLoggedIn, onLogout, user, dark, setDark }) => {
  const location = useLocation();
  const navItem = (to, label, icon) => (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
        location.pathname === to 
          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/50 scale-105" 
          : "text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-cyan-500/30 hover:scale-105"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Gauge size={24} className="text-teal-400" />
          </motion.div>
          <span className="text-lg font-bold tracking-wide">ATS Scorer</span>
        </motion.div>
        <nav className="flex items-center gap-2">
          {navItem("/", "Home", <Home size={14} />)}
          {!isLoggedIn && navItem("/signin", "Login", <KeyRound size={14} />)}
          {!isLoggedIn && navItem("/signup", "Register", <ArrowUpRight size={14} />)}
          {isLoggedIn && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDark((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300"
              >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </motion.button>
              <span className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-slate-200 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
                <UserCircle2 size={14} />
                {user?.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
              >
                <LogOut size={14} />
                Logout
              </motion.button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const onUploadClick = () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <main className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <motion.section
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className={`${glowCard} p-12 border-gradient-to-r from-teal-500/50 to-emerald-500/50 border-2 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-emerald-500/5 rounded-2xl"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl"></div>
          
          <motion.h1 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 text-center text-6xl font-extrabold tracking-tight md:text-7xl bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent"
          >
            ATS Resume Analyzer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-xl text-slate-200 leading-relaxed"
          >
            Upload your resume and instantly get <span className="text-teal-300 font-semibold">ATS score</span>, <span className="text-emerald-300 font-semibold">keyword insights</span>, <span className="text-cyan-300 font-semibold">formatting checks</span>, and targeted role recommendations with smooth, data-rich feedback.
          </motion.p>
          <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 50px rgba(20, 184, 166, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onUploadClick}
              className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-3 font-bold text-white transition hover:from-teal-600 hover:to-emerald-600 shadow-lg"
            >
              ✨ Upload Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 50px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signin")}
              className="rounded-xl border-2 border-gradient-to-r from-cyan-400 to-sky-400 px-8 py-3 font-bold text-cyan-300 transition hover:bg-cyan-500/20 shadow-lg"
            >
              Learn More
            </motion.button>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 mt-8 text-center text-sm text-teal-300 font-medium"
          >
            🔒 Access to dashboard unlocks after uploading your first resume
          </motion.p>
        </motion.section>

        <motion.section
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: <KeyRound className="text-teal-300" size={28} />,
              title: "Keyword Matching",
              text: "Detects role-specific and ATS-relevant keywords from your resume.",
              color: "from-teal-600/30 to-teal-400/10",
              borderColor: "border-teal-500/50"
            },
            {
              icon: <ShieldCheck className="text-emerald-300" size={28} />,
              title: "Format Analysis",
              text: "Checks layout quality, section structure, and parser friendliness.",
              color: "from-emerald-600/30 to-emerald-400/10",
              borderColor: "border-emerald-500/50"
            },
            {
              icon: <BarChart3 className="text-cyan-300" size={28} />,
              title: "Scoring System",
              text: "Scores your resume based on completeness, relevance, and readability.",
              color: "from-cyan-600/30 to-cyan-400/10",
              borderColor: "border-cyan-500/50"
            },
          ].map((item, idx) => (
            <motion.div
              whileHover={{ y: -12, scale: 1.05 }}
              key={item.title}
              className={`${glowCard} border-2 ${item.borderColor} bg-gradient-to-br ${item.color} p-8 transition relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                className="relative z-10"
              >
                {item.icon}
              </motion.div>
              <h3 className="relative z-10 mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="relative z-10 mt-3 text-slate-300">{item.text}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${glowCard} mt-16 border-2 border-gradient-to-r from-teal-500/50 via-emerald-500/50 to-cyan-500/50 bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-cyan-500/5 p-12`}
        >
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-center text-4xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-3"
          >
            Why Choose ATS Scorer?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Everything you need to make your resume stand out to ATS systems
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Real-time Analysis",
                description: "Instant feedback on your resume with detailed metrics",
                color: "from-teal-500/20 to-teal-400/10",
                borderColor: "border-teal-500/50",
                iconColor: "text-teal-400"
              },
              {
                icon: "🎯",
                title: "Smart Recommendations",
                description: "Tailored job suggestions based on your skills and experience",
                color: "from-emerald-500/20 to-emerald-400/10",
                borderColor: "border-emerald-500/50",
                iconColor: "text-emerald-400"
              },
              {
                icon: "📊",
                title: "Visual Breakdown",
                description: "See exactly how your resume scores across all metrics",
                color: "from-cyan-500/20 to-cyan-400/10",
                borderColor: "border-cyan-500/50",
                iconColor: "text-cyan-400"
              },
              {
                icon: "🚀",
                title: "Actionable Insights",
                description: "Get specific improvements to boost your ATS score",
                color: "from-teal-500/20 to-teal-400/10",
                borderColor: "border-teal-500/50",
                iconColor: "text-teal-400"
              },
              {
                icon: "🔐",
                title: "100% Secure",
                description: "Your data is completely private and never shared",
                color: "from-emerald-500/20 to-emerald-400/10",
                borderColor: "border-emerald-500/50",
                iconColor: "text-emerald-400"
              },
              {
                icon: "💡",
                title: "AI Optimization",
                description: "Smart keyword suggestions to match job requirements",
                color: "from-cyan-500/20 to-cyan-400/10",
                borderColor: "border-cyan-500/50",
                iconColor: "text-cyan-400"
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className={`${glowCard} border-2 ${benefit.borderColor} bg-gradient-to-br ${benefit.color} p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <motion.div 
                  className={`text-5xl mb-4 relative z-10 ${benefit.iconColor}`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{benefit.title}</h3>
                <p className="text-sm text-slate-300 relative z-10">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

const AuthPage = ({ mode, onAuth }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const path = mode === "signup" ? "/auth/signup" : "/auth/signin";
    const { data } = await api.post(path, form);
    onAuth(data);
    navigate("/dashboard");
  };

  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      
      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={submit}
        className={`${glowCard} w-full max-w-md space-y-6 p-8 border-2 border-gradient-to-r from-teal-500/50 to-emerald-500/50 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 relative z-10`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 rounded-2xl pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            {isSignup ? "Join ATS Scorer today" : "Sign in to continue your journey"}
          </p>
        </motion.div>

        {isSignup && (
          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileFocus={{ scale: 1.02 }}
            className="relative z-10 w-full rounded-xl border-2 border-teal-500/30 bg-teal-500/10 px-4 py-3 placeholder:text-slate-500 text-white focus:border-teal-500/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all duration-300 backdrop-blur-sm"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          whileFocus={{ scale: 1.02 }}
          className="relative z-10 w-full rounded-xl border-2 border-teal-500/30 bg-teal-500/10 px-4 py-3 placeholder:text-slate-500 text-white focus:border-teal-500/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all duration-300 backdrop-blur-sm"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileFocus={{ scale: 1.02 }}
          className="relative z-10 w-full rounded-xl border-2 border-teal-500/30 bg-teal-500/10 px-4 py-3 placeholder:text-slate-500 text-white focus:border-teal-500/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all duration-300 backdrop-blur-sm"
          type="password"
          placeholder="Password (min. 6 chars)"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(20, 184, 166, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 font-bold text-white transition hover:from-teal-600 hover:to-emerald-600 shadow-lg"
        >
          {isSignup ? "✨ Create Account" : "🚀 Sign In"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 text-center text-sm text-slate-400"
        >
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Sign in here
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Create one now
              </Link>
            </>
          )}
        </motion.div>
      </motion.form>
    </div>
  );
};

const Dashboard = ({ token, user, onLogout, dark, setDark }) => {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [uploadMessage, setUploadMessage] = useState("");
  const [activeSections, setActiveSections] = useState(new Set());
  const [isRampageMode, setIsRampageMode] = useState(false);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data } = await api.get(`/resumes?ts=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(data);
    setReport((prev) => prev || data[0] || null);
    setLoadingHistory(false);
  };

  const uploadResume = async (file) => {
    try {
      setUploadMessage("");
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await api.post("/resumes/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(data);
      setUploadMessage(
        data?.duplicate
          ? "Resume uploaded again and analyzed with latest results."
          : "Resume uploaded and analyzed successfully."
      );
      loadHistory();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to upload resume right now. Please try again.";
      setUploadMessage(message);
    }
  };

  const toggleSection = (sectionName) => {
    setActiveSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const toggleRampageMode = () => {
    setIsRampageMode(prev => !prev);
    if (!isRampageMode) {
      // Enter rampage mode - show all sections
      setActiveSections(new Set(pieData.map(item => item.name)));
    } else {
      // Exit rampage mode - hide all sections
      setActiveSections(new Set());
    }
  };

  const theme = dark
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100"
    : "bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50 text-slate-900";
  const hasUploadAccess = history.length > 0;
  const cards = useMemo(
    () => [
      { label: "ATS Score", value: report?.atsScore ?? "--" },
      { label: "Keyword Match", value: report ? `${report.keywordMatch}%` : "--" },
      { label: "Section Completeness", value: report ? `${report.sectionCompleteness}%` : "--" },
      { label: "Readability", value: report ? `${report.readability}%` : "--" },
    ],
    [report]
  );
  const pieData = useMemo(() => {
    if (!report) return [];
    return [
      { name: "Keyword Match", value: report.keywordMatch, color: "#14b8a6", gradient: "url(#keywordGradient)" },
      { name: "Section Completeness", value: report.sectionCompleteness, color: "#10b981", gradient: "url(#sectionGradient)" },
      { name: "Readability", value: report.readability, color: "#06b6d4", gradient: "url(#readabilityGradient)" },
      { name: "Other", value: Math.max(0, 100 - report.keywordMatch - report.sectionCompleteness - report.readability), color: "#0e7490", gradient: "url(#otherGradient)" },
    ];
  }, [report]);

  return (
    <div className={`min-h-screen ${theme} transition-colors`}>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.label
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(20, 184, 166, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className={`${glowCard} flex cursor-pointer items-center justify-center gap-4 border-2 border-dashed border-gradient-to-r from-teal-500 to-emerald-500 p-12 hover:border-teal-400/80 transition-all duration-300 relative overflow-hidden group bg-gradient-to-br from-teal-500/10 to-emerald-500/10`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <FileUp size={32} className="text-gradient-to-r from-teal-400 to-emerald-400 text-teal-400" />
          </motion.div>
          <div className="text-center relative z-10">
            <p className="text-lg font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-1">Drop or Upload PDF/DOCX Resume</p>
            <p className="text-sm text-slate-400">Get instant ATS analysis and recommendations</p>
          </div>
          <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} />
        </motion.label>
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${glowCard} border-teal-400/30 bg-teal-400/10 p-4 text-sm ${dark ? 'text-teal-100' : 'text-teal-900'} border-l-4 border-teal-400`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              {uploadMessage}
            </div>
          </motion.div>
        )}

        {!loadingHistory && !hasUploadAccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glowCard} border-amber-500/40 bg-amber-500/10 p-4 ${dark ? 'text-amber-100' : 'text-amber-900'} border-l-4 border-amber-400`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              Upload your first resume to unlock ATS analytics and recommendations.
            </div>
          </motion.div>
        )}

        {hasUploadAccess && (
          <>
            <section className="grid md:grid-cols-4 gap-6">
              {cards.map((card, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.08, boxShadow: "0 30px 60px rgba(20, 184, 166, 0.4)" }}
                  key={card.label}
                  className={`${glowCard} p-6 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/10 border-2 border-gradient-to-r from-teal-500/30 to-emerald-500/30 hover:border-teal-500/60 transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-700'} font-medium mb-2 relative z-10 uppercase tracking-wide`}>{card.label}</p>
                  <p className="text-5xl font-black mt-2 relative z-10 bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    {card.value}
                  </p>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                </motion.div>
              ))}
            </section>
            {report && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${glowCard} p-6 border-2 border-gradient-to-r from-teal-500/30 to-cyan-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-teal-500/5 rounded-2xl animate-pulse"></div>

                {/* Rampage Mode Toggle */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    ATS Score Breakdown
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleRampageMode}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                      isRampageMode
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/50'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 hover:from-teal-600 hover:to-emerald-600 hover:text-white'
                    }`}
                  >
                    {isRampageMode ? '🔥 RAMPAGE MODE' : '⚡ ACTIVATE RAMPAGE'}
                  </motion.button>
                </div>

                <div className="relative">
                  {/* Aggressive Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 via-emerald-900/20 to-cyan-900/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>

                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <defs>
                        {/* Enhanced Rampage Gradients */}
                        <linearGradient id="keywordGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#2dd4bf" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#5eead4" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#99f6e4" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#ccfbf1" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#f0fdfa" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="sectionGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#10b981" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#34d399" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#6ee7b7" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#a7f3d0" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#d1fae5" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="readabilityGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#0891b2" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#06b6d4" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#22d3ee" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#67e8f9" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#a5f3fc" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#cffafe" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="otherGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#0e7490" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#155e75" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#164e63" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#083344" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#032f3a" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#0c2835" stopOpacity={0.98}/>
                        </linearGradient>

                        {/* Rampage Filters */}
                        <filter id="rampageGlow">
                          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <filter id="rampageShadow">
                          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(20, 184, 166, 0.6)"/>
                        </filter>
                        <filter id="fireEffect">
                          <feTurbulence baseFrequency="0.05" numOctaves="3" result="noise"/>
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5"/>
                          <feGaussianBlur stdDeviation="2"/>
                        </filter>
                      </defs>

                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={isRampageMode ? 130 : 110}
                        innerRadius={isRampageMode ? 60 : 50}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => activeSections.has(name) || activeSections.size === 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                        labelLine={false}
                        animationBegin={0}
                        animationDuration={isRampageMode ? 3000 : 2500}
                        animationEasing="ease-out"
                        onClick={(data, index) => toggleSection(data.name)}
                      >
                        {pieData.map((entry, index) => {
                          const isActive = activeSections.has(entry.name) || activeSections.size === 0;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={isActive ? entry.gradient : 'url(#otherGradient)'}
                              stroke={entry.color}
                              strokeWidth={isRampageMode ? 6 : 4}
                              filter={isRampageMode ? "url(#rampageGlow) url(#fireEffect)" : "url(#rampageGlow)"}
                              className={`transition-all duration-700 cursor-pointer ${
                                isRampageMode
                                  ? 'hover:scale-110 hover:rotate-12 animate-pulse'
                                  : 'hover:scale-105 hover:opacity-90'
                              }`}
                              style={{
                                filter: isRampageMode
                                  ? 'drop-shadow(0 8px 16px rgba(20, 184, 166, 0.8)) brightness(1.2)'
                                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                                opacity: isActive ? 1 : 0.3,
                                transform: isRampageMode ? 'scale(1.05)' : 'scale(1)',
                              }}
                            />
                          );
                        })}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.98)',
                          border: '2px solid #14b8a6',
                          borderRadius: '20px',
                          boxShadow: '0 25px 50px rgba(20, 184, 166, 0.5)',
                          backdropFilter: 'blur(20px)',
                          color: '#e2e8f0',
                          fontSize: '16px',
                          fontWeight: '600',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                        labelStyle={{
                          color: '#2dd4bf',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                        }}
                      />

                      <Legend
                        wrapperStyle={{
                          paddingTop: '30px',
                          color: '#cbd5e1'
                        }}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            style={{
                              color: activeSections.has(value) || activeSections.size === 0 ? entry.color : '#666',
                              fontWeight: '700',
                              fontSize: '16px',
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                              cursor: 'pointer'
                            }}
                            onClick={() => toggleSection(value)}
                            className="transition-all duration-300 hover:text-teal-400"
                          >
                            {value}
                          </motion.span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Rampage Mode Effects */}
                  {isRampageMode && (
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-50"
                      ></motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-cyan-500/20"
                      ></motion.div>
                    </>
                  )}

                  {/* Aggressive Floating Particles */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 10, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-4 right-4 w-5 h-5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-2xl animate-pulse"
                  ></motion.div>

                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                      x: [0, -15, 0],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full shadow-2xl"
                  ></motion.div>

                  <motion.div
                    animate={{
                      scale: [0.8, 1.5, 0.8],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-teal-500 rounded-full opacity-60"
                  ></motion.div>

                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                    className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full shadow-xl"
                  ></motion.div>
                </div>
              </motion.section>
            )}
            {report && (
              <section className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)" }}
                  className={`${glowCard} p-6 border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 hover:border-red-500/60 transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="font-bold mb-4 text-lg relative z-10 text-red-300">⚠️ Missing Keywords</h2>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {report.missingKeywords.map((k, idx) => (
                      <motion.span
                        key={k}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.15, backgroundColor: "rgba(239, 68, 68, 0.4)" }}
                        className="text-xs rounded-full bg-red-500/20 px-3 py-2 hover:bg-red-500/40 transition-all duration-200 cursor-pointer border border-red-500/50 text-red-200 font-semibold"
                      >
                        {k}
                      </motion.span>
                    ))}
                  </div>
                  <h3 className="font-bold mt-6 mb-3 text-lg relative z-10 text-teal-300">💡 Improvements</h3>
                  <ul className="text-sm space-y-3 relative z-10">
                    {report.improvements.map((i, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="hover:text-teal-300 transition-colors duration-200 flex items-start gap-3"
                      >
                        <span className="text-teal-400 mt-1 text-lg">→</span>
                        <span className="text-slate-300">{i}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
                  className={`${glowCard} p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/60 transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="font-bold mb-4 text-lg relative z-10 text-emerald-300">🎯 Job Recommendations</h2>
                  <div className="space-y-4 relative z-10">
                    {report.jobRecommendations.map((job, idx) => (
                      <motion.div
                        key={job.role}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: dark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)" }}
                        className={`rounded-xl ${dark ? 'bg-slate-900/50' : 'bg-white/70'} border-2 border-emerald-500/30 p-4 hover:border-emerald-500/60 transition-all duration-200`}
                      >
                        <p className="font-bold text-lg text-emerald-300 mb-2">{job.role}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${job.matchPercent}%` }}
                              transition={{ delay: idx * 0.2, duration: 1 }}
                              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full"
                            ></motion.div>
                          </div>
                          <span className="text-sm font-bold text-emerald-400">{job.matchPercent}%</span>
                        </div>
                        <p className={`text-xs flex flex-wrap gap-2`}>
                          {job.trendingSkills.map((skill, skillIdx) => (
                            <motion.span 
                              key={skillIdx}
                              whileHover={{ scale: 1.1 }}
                              className={`bg-cyan-500/30 text-cyan-200 px-2 py-1 rounded-full text-xs font-medium border border-cyan-500/50`}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className={`${glowCard} p-6 border-2 border-gradient-to-r from-cyan-500/30 to-sky-500/30 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 hover:border-cyan-500/60 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="font-bold mb-4 text-lg relative z-10 text-cyan-300">📊 Improvement History</h2>
              <div className="space-y-3 text-sm relative z-10">
                {history.map((h, idx) => (
                  <motion.div
                    key={h._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03, backgroundColor: dark ? "rgba(6, 182, 212, 0.15)" : "rgba(6, 182, 212, 0.1)" }}
                    className={`flex justify-between rounded-xl ${dark ? 'bg-slate-900/50' : 'bg-white/70'} border-2 border-cyan-500/30 p-4 hover:border-cyan-500/60 transition-all duration-200`}
                  >
                    <span className={`font-semibold text-lg ${dark ? 'text-cyan-200' : 'text-cyan-800'}`}>{h.originalName}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${h.atsScore}%` }}
                          transition={{ delay: idx * 0.1, duration: 1 }}
                          className="bg-gradient-to-r from-cyan-400 to-sky-400 h-2 rounded-full"
                        ></motion.div>
                      </div>
                      <span className="font-bold text-cyan-400 text-lg min-w-12 text-right">{h.atsScore}/100</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
};

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl text-center py-8 text-sm text-slate-300"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.p 
          className="flex items-center justify-center gap-2 flex-wrap"
          whileHover={{ scale: 1.02 }}
        >
          <span>© 2026 ATS Scorer.</span>
          <span>Built by</span>
          <motion.span 
            className="font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.15 }}
          >
            Karthikeya
          </motion.span>
          <span>and</span>
          <motion.span 
            className="font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.15 }}
          >
            Praveen
          </motion.span>
          <span>•</span>
          <span>All rights reserved.</span>
        </motion.p>
      </div>
    </motion.footer>
  );
};

function App() {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("auth") || "null"));
  const [dark, setDark] = useState(true);

  const handleAuth = (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <>
      <TopNav isLoggedIn={Boolean(auth?.token)} onLogout={logout} user={auth?.user} dark={dark} setDark={setDark} />
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={Boolean(auth?.token)} />} />
        <Route path="/signin" element={<AuthPage mode="signin" onAuth={handleAuth} />} />
        <Route path="/signup" element={<AuthPage mode="signup" onAuth={handleAuth} />} />
        <Route path="/dashboard" element={auth?.token ? <Dashboard token={auth.token} user={auth.user} onLogout={logout} dark={dark} setDark={setDark} /> : <Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
