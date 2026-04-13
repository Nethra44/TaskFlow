import React from "react";
import {
  User,
  LogOut,
  ShieldCheck,
  Mail,
  Database,
  Terminal,
} from "lucide-react";

export default function Settings() {
  const userId = localStorage.getItem("userId") || "---";
  const userEmail = localStorage.getItem("userEmail") || "user@taskflow.dev";

  // Pull the userName we just stored in AuthPage
  const storedName = localStorage.getItem("userName");
  const userName =
    storedName && storedName !== "undefined" && storedName !== "User"
      ? storedName
      : userEmail.split("@")[0];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
          <User size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
            {userName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Session Verified
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Mail size={18} className="text-slate-300" />
            <span className="text-sm font-bold text-slate-600">
              Primary Email
            </span>
          </div>
          <span className="text-sm font-medium text-slate-400">
            {userEmail}
          </span>
        </div>

        <div className="flex items-center justify-between py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Terminal size={18} className="text-slate-300" />
            <span className="text-sm font-bold text-slate-600">
              Database ID
            </span>
          </div>
          <code className="text-[11px] font-mono text-blue-500 bg-blue-50 px-2 py-1 rounded">
            {userId}
          </code>
        </div>

        <div className="flex items-center justify-between py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Database size={18} className="text-slate-300" />
            <span className="text-sm font-bold text-slate-600">
              System Status
            </span>
          </div>
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            Operational
          </span>
        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 text-red-500 hover:text-red-700 font-black text-sm uppercase tracking-widest transition-all"
        >
          <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
            <LogOut size={18} />
          </div>
          Sign out of Workspace
        </button>
      </div>

      <footer className="mt-24 pt-8 border-t border-slate-50 flex justify-between items-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          TaskFlow Engine v1.0.4
        </p>
        <ShieldCheck size={16} className="text-slate-400" />
      </footer>
    </div>
  );
}
