import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Layers,
  X,
  Zap,
  CheckCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen, currentView, setView }) {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "All Tasks", icon: <Layers size={20} /> },
    { name: "Today", icon: <CheckSquare size={20} /> },
    { name: "Upcoming", icon: <Clock size={20} /> },
    { name: "Completed", icon: <CheckCircle size={20} /> },
  ];

  const handleNavClick = (viewName) => {
    setView(viewName);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Returns user to AuthPage
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-140 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Changed to flex flex-col to allow bottom alignment */}
      <aside
        className={`fixed inset-y-0 left-0 z-150 w-64 bg-[#0f172a] text-slate-400 p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Branding */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-900/50">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight tracking-tight">
                TaskFlow
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu - flex-1 fills available space */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                currentView === item.name
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        {/* Bottom Section: Settings & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-1">
          <button
            onClick={() => handleNavClick("Settings")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              currentView === "Settings"
                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <Settings size={20} /> Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
