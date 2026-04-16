import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)]";

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

  useEffect(() => {
    loadHistory();
  }, []);

  const theme = dark
    ? "bg-[radial-gradient(circle_at_top,#201252_0%,#130839_45%,#0d052b_100%)] text-slate-50"
    : "bg-slate-100 text-slate-900";
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

  return (
    <div className={`min-h-screen ${theme} transition-colors`}>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.label
          whileHover={{ scale: 1.01 }}
          className={`${glowCard} flex cursor-pointer items-center justify-center gap-2 border-dashed border-indigo-400/50 p-10`}
        >
          <FileUp size={18} /> Drop or Upload PDF/DOCX Resume
          <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} />
        </motion.label>
        {uploadMessage && (
          <div className={`${glowCard} border-cyan-400/30 bg-cyan-400/10 p-3 text-sm text-cyan-100`}>
            {uploadMessage}
          </div>
        )}

        {!loadingHistory && !hasUploadAccess && (
          <div className={`${glowCard} border-amber-500/40 bg-amber-500/10 p-4 text-amber-100`}>
            Upload your first resume to unlock ATS analytics and recommendations.
          </div>
        )}

        {hasUploadAccess && (
          <>
            <section className="grid md:grid-cols-4 gap-4">
              {cards.map((card) => (
                <motion.div whileHover={{ y: -4 }} key={card.label} className={`${glowCard} p-4`}>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="text-3xl font-semibold mt-2">{card.value}</p>
                </motion.div>
              ))}
            </section>
            {report && (
              <section className="grid md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glowCard} p-4`}>
                  <h2 className="font-semibold mb-2">Missing Keywords</h2>
                  <div className="flex flex-wrap gap-2">{report.missingKeywords.map((k) => <span key={k} className="text-xs rounded-full bg-red-500/20 px-2 py-1">{k}</span>)}</div>
                  <h3 className="font-semibold mt-4 mb-2">Improvements</h3>
                  <ul className="text-sm space-y-1">{report.improvements.map((i, idx) => <li key={idx}>- {i}</li>)}</ul>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glowCard} p-4`}>
                  <h2 className="font-semibold mb-2">Job Recommendations</h2>
                  <div className="space-y-3">{report.jobRecommendations.map((job) => <div key={job.role} className="rounded-lg bg-slate-900/40 p-3"><p className="font-medium">{job.role} ({job.matchPercent}%)</p><p className="text-xs text-slate-400">{job.trendingSkills.join(", ")}</p></div>)}</div>
                </motion.div>
              </section>
            )}
            <section className={`${glowCard} p-4`}>
              <h2 className="font-semibold mb-3">Improvement History</h2>
              <div className="space-y-2 text-sm">{history.map((h) => <div key={h._id} className="flex justify-between rounded-lg bg-slate-900/40 p-2"><span>{h.originalName}</span><span>{h.atsScore}/100</span></div>)}</div>
            </section>
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
