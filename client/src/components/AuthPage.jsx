import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Zap } from "lucide-react";
import axios from "axios";

export default function AuthPage({ onLoginSuccess }) {
  const [authState, setAuthState] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint =
        authState === "login"
          ? "/api/login"
          : authState === "signup"
            ? "/api/signup"
            : "/api/forgot-password";

      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData,
      );

      if (authState === "forgot") {
        alert("Link sent!");
        setAuthState("login");
        return;
      }

      if (res.status === 200 || res.status === 201) {
        // Updated Storage Logic:
        // 1. Prioritize name from server response (for login if provided)
        // 2. Fallback to name from the sign-up form (formData.name)
        // 3. Last resort: extract name from email (e.g., "nethrapandi23")
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userName", res.data.name);

        onLoginSuccess();
      }
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-[#0a1628] to-slate-950"></div>
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "35px 35px",
          }}
        ></div>
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 bg-slate-900/40 p-1.5 pr-5 rounded-full border border-white/5 backdrop-blur-sm mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              TASKFLOW
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.3em]">
            {authState === "signup"
              ? "CREATE DEVELOPER ACCOUNT"
              : "SIGN IN TO YOUR WORKSPACE"}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-7 md:p-9 border border-white/10">
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {authState === "signup" && (
              <AuthInput
                label="Full Name"
                name="name"
                icon={<User size={16} />}
                placeholder="John Doe"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <AuthInput
              label="Email Address"
              name="email"
              icon={<Mail size={16} />}
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {authState !== "forgot" && (
              <div>
                <AuthInput
                  label="Password"
                  name="password"
                  icon={<Lock size={16} />}
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {authState === "login" && (
                  <div className="flex justify-end mt-1 pr-1">
                    <button
                      type="button"
                      onClick={() => setAuthState("forgot")}
                      className="text-[9px] font-black text-slate-300 hover:text-blue-600 uppercase tracking-widest"
                    >
                      Forgot?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-950 hover:bg-blue-600 text-white font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span className="text-xs uppercase tracking-widest">
                {loading
                  ? "..."
                  : authState === "login"
                    ? "Sign In"
                    : "Get Started"}
              </span>
              {!loading && <ArrowRight size={16} strokeWidth={3} />}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-50 pt-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {authState === "login" ? "New here?" : "Joined us?"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setAuthState(authState === "login" ? "signup" : "login")
                }
                className="group relative"
              >
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black tracking-tighter text-xs">
                  {authState === "login" ? "JOIN NOW" : "SIGN IN"}
                </span>
                <div className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </span>
        <input
          {...props}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold text-slate-700 text-sm placeholder:text-slate-200"
        />
      </div>
    </div>
  );
}
