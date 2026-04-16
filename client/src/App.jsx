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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition ${
        location.pathname === to ? "bg-white/15 text-white" : "text-indigo-100 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#3c2ca2]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Gauge size={18} />
          <span className="font-semibold tracking-wide">ATS Scorer</span>
        </div>
        <nav className="flex items-center gap-3">
          {navItem("/", "Home", <Home size={14} />)}
          {!isLoggedIn && navItem("/signin", "Login", <KeyRound size={14} />)}
          {!isLoggedIn && navItem("/signup", "Register", <ArrowUpRight size={14} />)}
          {isLoggedIn && (
            <>
              <button
                onClick={() => setDark((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-indigo-100 hover:bg-white/10"
              >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-indigo-100">
                <UserCircle2 size={14} />
                {user?.name}
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-2 text-sm text-white hover:bg-rose-500"
              >
                <LogOut size={14} />
                Logout
              </button>
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#4f35d6_0%,#23105f_32%,#17093f_72%,#0f062f_100%)] text-slate-100">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <motion.section
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className={`${glowCard} p-10`}
        >
          <h1 className="text-center text-5xl font-extrabold tracking-tight md:text-6xl">
            ATS Resume Analyzer
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-indigo-100">
            Upload your resume and instantly get ATS score, keyword insights, formatting checks,
            and targeted role recommendations with smooth, data-rich feedback.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={onUploadClick}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 font-medium text-slate-900 transition hover:scale-[1.03] hover:bg-cyan-400"
            >
              Upload Resume
            </button>
          </div>
          <p className="mt-5 text-center text-sm text-indigo-200">
            Access to analysis dashboard is locked until at least one resume is uploaded.
          </p>
        </motion.section>

        <motion.section
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {[
            {
              icon: <KeyRound className="text-cyan-300" />,
              title: "Keyword Matching",
              text: "Detects role-specific and ATS-relevant keywords from your resume.",
            },
            {
              icon: <ShieldCheck className="text-yellow-300" />,
              title: "Format Analysis",
              text: "Checks layout quality, section structure, and parser friendliness.",
            },
            {
              icon: <BarChart3 className="text-emerald-300" />,
              title: "Scoring System",
              text: "Scores your resume based on completeness, relevance, and readability.",
            },
          ].map((item) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.title}
              className={`${glowCard} p-5 transition`}
            >
              {item.icon}
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-indigo-100">{item.text}</p>
            </motion.div>
          ))}
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#4f35d6_0%,#2d1575_30%,#170a42_100%)] p-4 text-slate-100">
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className={`${glowCard} w-full max-w-md space-y-4 p-6`}
      >
        <h1 className="text-center text-3xl font-bold">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-sm text-indigo-100">
          {mode === "signup" ? "Join ATS Scorer" : "Sign in to continue"}
        </p>
        {mode === "signup" && (
          <input
            className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 placeholder:text-indigo-100/70"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 placeholder:text-indigo-100/70"
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 placeholder:text-indigo-100/70"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full rounded-lg bg-cyan-400 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300">
          {mode === "signup" ? "Create Account" : "Sign In"}
        </button>
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
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-slate-100"
    : "bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 text-slate-900";
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
      { name: "Keyword Match", value: report.keywordMatch, color: "#6366f1", gradient: "url(#keywordGradient)" },
      { name: "Section Completeness", value: report.sectionCompleteness, color: "#10b981", gradient: "url(#sectionGradient)" },
      { name: "Readability", value: report.readability, color: "#f59e0b", gradient: "url(#readabilityGradient)" },
      { name: "Other", value: Math.max(0, 100 - report.keywordMatch - report.sectionCompleteness - report.readability), color: "#ef4444", gradient: "url(#otherGradient)" },
    ];
  }, [report]);

  return (
    <div className={`min-h-screen ${theme} transition-colors`}>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.label
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}
          whileTap={{ scale: 0.98 }}
          className={`${glowCard} flex cursor-pointer items-center justify-center gap-3 border-dashed border-indigo-400/50 p-12 hover:border-indigo-400/80 transition-all duration-300 relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileUp size={24} className="text-indigo-400" />
          </motion.div>
          <div className="text-center relative z-10">
            <p className="text-lg font-semibold mb-1">Drop or Upload PDF/DOCX Resume</p>
            <p className="text-sm text-slate-400">Get instant ATS analysis and recommendations</p>
          </div>
          <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} />
        </motion.label>
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${glowCard} border-cyan-400/30 bg-cyan-400/10 p-4 text-sm ${dark ? 'text-cyan-100' : 'text-cyan-900'} border-l-4 border-cyan-400`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
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
                  whileHover={{ y: -8, scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}
                  key={card.label}
                  className={`${glowCard} p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-700'} font-medium mb-2 relative z-10`}>{card.label}</p>
                  <p className="text-4xl font-bold mt-2 relative z-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {card.value}
                  </p>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </motion.div>
              ))}
            </section>
            {report && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${glowCard} p-6 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 rounded-2xl animate-pulse"></div>

                {/* Rampage Mode Toggle */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
                  >
                    ATS Score Breakdown
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleRampageMode}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                      isRampageMode
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 hover:from-red-600 hover:to-orange-600 hover:text-white'
                    }`}
                  >
                    {isRampageMode ? '🔥 RAMPAGE MODE' : '⚡ ACTIVATE RAMPAGE'}
                  </motion.button>
                </div>

                <div className="relative">
                  {/* Aggressive Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>

                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <defs>
                        {/* Enhanced Rampage Gradients */}
                        <linearGradient id="keywordGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#f87171" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#fca5a5" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#fecaca" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#fee2e2" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#fef2f2" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="sectionGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#fb923c" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#fdba74" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#fed7aa" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#ffedd5" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#fff7ed" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="readabilityGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#eab308" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#facc15" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#fde047" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#fef08a" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#fefce8" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#ffffe0" stopOpacity={0.98}/>
                        </linearGradient>
                        <linearGradient id="otherGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#dc2626" stopOpacity={0.98}/>
                          <stop offset="20%" stopColor="#ef4444" stopOpacity={0.98}/>
                          <stop offset="40%" stopColor="#f87171" stopOpacity={0.98}/>
                          <stop offset="60%" stopColor="#fca5a5" stopOpacity={0.98}/>
                          <stop offset="80%" stopColor="#fecaca" stopOpacity={0.98}/>
                          <stop offset="100%" stopColor="#fef2f2" stopOpacity={0.98}/>
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
                          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(239, 68, 68, 0.6)"/>
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
                                  ? 'drop-shadow(0 8px 16px rgba(239, 68, 68, 0.8)) brightness(1.2)'
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
                          border: '2px solid #ef4444',
                          borderRadius: '20px',
                          boxShadow: '0 25px 50px rgba(239, 68, 68, 0.5)',
                          backdropFilter: 'blur(20px)',
                          color: '#e2e8f0',
                          fontSize: '16px',
                          fontWeight: '600',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                        labelStyle={{
                          color: '#f87171',
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
                            className="transition-all duration-300 hover:text-red-400"
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
                        className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-50"
                      ></motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20"
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
                    className="absolute top-4 right-4 w-5 h-5 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-2xl animate-pulse"
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
                    className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full shadow-2xl"
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
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-red-500 rounded-full opacity-60"
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
                    className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full shadow-xl"
                  ></motion.div>
                </div>
              </motion.section>
            )}
            {report && (
              <section className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  className={`${glowCard} p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="font-semibold mb-3 text-lg relative z-10">Missing Keywords</h2>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {report.missingKeywords.map((k, idx) => (
                      <motion.span
                        key={k}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                        className="text-xs rounded-full bg-red-500/20 px-3 py-2 hover:bg-red-500/40 transition-all duration-200 cursor-pointer border border-red-500/30"
                      >
                        {k}
                      </motion.span>
                    ))}
                  </div>
                  <h3 className="font-semibold mt-6 mb-3 text-lg relative z-10">Improvements</h3>
                  <ul className="text-sm space-y-2 relative z-10">
                    {report.improvements.map((i, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="hover:text-cyan-300 transition-colors duration-200 flex items-start gap-2"
                      >
                        <span className="text-cyan-400 mt-1">•</span>
                        {i}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  className={`${glowCard} p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="font-semibold mb-3 text-lg relative z-10">Job Recommendations</h2>
                  <div className="space-y-4 relative z-10">
                    {report.jobRecommendations.map((job, idx) => (
                      <motion.div
                        key={job.role}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, backgroundColor: dark ? "#1e293b" : "#f8fafc" }}
                        className="rounded-xl bg-slate-900/40 p-4 hover:bg-slate-900/60 transition-all duration-200 border border-slate-700/50 hover:border-slate-600/70"
                      >
                        <p className="font-semibold text-lg mb-1">{job.role}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${job.matchPercent}%` }}
                              transition={{ delay: idx * 0.2, duration: 1 }}
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                            ></motion.div>
                          </div>
                          <span className="text-sm font-medium text-green-400">{job.matchPercent}%</span>
                        </div>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-700'} flex flex-wrap gap-1`}>
                          {job.trendingSkills.map((skill, skillIdx) => (
                            <span key={skillIdx} className={`bg-blue-500/20 ${dark ? 'text-blue-300' : 'text-blue-700'} px-2 py-1 rounded-full text-xs`}>
                              {skill}
                            </span>
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
              className={`${glowCard} p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="font-semibold mb-4 text-lg relative z-10">Improvement History</h2>
                      <div className="space-y-3 text-sm relative z-10">
                {history.map((h, idx) => (
                  <motion.div
                    key={h._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: dark ? "#1e293b" : "#f1f5f9" }}
                    className={`flex justify-between rounded-xl ${dark ? 'bg-slate-900/40' : 'bg-white/60'} p-4 hover:bg-slate-900/60 transition-all duration-200 border ${dark ? 'border-slate-700/50' : 'border-slate-200/50'} hover:border-slate-600/70`}
                  >
                    <span className={`font-medium ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{h.originalName}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${h.atsScore}%` }}
                          transition={{ delay: idx * 0.1, duration: 1 }}
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                        ></motion.div>
                      </div>
                      <span className="font-bold text-yellow-400">{h.atsScore}/100</span>
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
    </>
  );
}

export default App;
