import React from "react";
import {
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Edit3,
  Trash2,
  Circle,
  Calendar,
} from "lucide-react";

export default function Dashboard({
  tasks = [],
  setView,
  onEdit,
  onDelete,
  onToggle,
}) {
  const totalTasks = tasks.length;

  // Logic to filter active tasks and sort by latest added
  const activeTasksList = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => {
      const idA = a._id || a.id || "";
      const idB = b._id || b.id || "";
      return idB.toString().localeCompare(idA.toString());
    });

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const todayStr = new Date().toISOString().split("T")[0];

  const dueTodayCount = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate === todayStr,
  ).length;

  const overdueCount = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate && t.dueDate < todayStr,
  ).length;

  const stats = [
    {
      label: "Total Tasks",
      val: totalTasks,
      sub: `${activeTasksList.length} active`,
      icon: <Layers size={18} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      val: completedTasks.length,
      sub: `${totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0}% rate`,
      icon: <CheckCircle size={18} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Due Today",
      val: dueTodayCount,
      sub: "Action needed",
      icon: <Clock size={18} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Overdue",
      val: overdueCount,
      sub: overdueCount > 0 ? "Urgent" : "Great job!",
      icon: <AlertTriangle size={18} />,
      color: overdueCount > 0 ? "text-rose-600" : "text-slate-400",
      bg: overdueCount > 0 ? "bg-rose-50" : "bg-slate-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-2rem border border-slate-100 flex items-start gap-4 shadow-sm"
          >
            <div className={`${s.bg} ${s.color} p-3 rounded-2xl`}>{s.icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Smart Priority Queue */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-10 min-h-450px flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Smart Priority Queue
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                3 most recently added tasks
              </p>
            </div>
            <button
              onClick={() => setView("All Tasks")}
              className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline transition-all"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {activeTasksList.slice(0, 3).map((task) => {
              const taskId = task._id || task.id;
              return (
                <div
                  key={taskId}
                  className="group flex items-center justify-between p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => onToggle(task._id, task.status)}
                      className="text-slate-300 hover:text-blue-500 transition-colors shrink-0"
                    >
                      <Circle size={22} />
                    </button>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm md:text-base tracking-tight truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            task.priority === "High"
                              ? "bg-rose-100 text-rose-600"
                              : task.priority === "Medium"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {task.priority || "Low"}
                        </span>
                        <span className="text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {task.category || "General"}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 ml-1">
                          <Calendar size={12} className="text-slate-300" />
                          <span className="whitespace-nowrap">
                            {task.dueDate || "No Date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Visible on hover/mobile */}
                  <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(taskId)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {activeTasksList.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300">
                <CheckCircle size={48} className="mb-4 opacity-20" />
                <p className="font-bold">No active tasks!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column: Priority & Category Breakdowns */}
        <div className="space-y-6 md:space-y-8">
          {/* Priority Breakdown Card */}
          <div className="bg-white rounded-2rem border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-wider">
              Priority Breakdown
            </h3>
            <div className="space-y-6">
              {["High", "Medium", "Low"].map((p) => (
                <div key={p} className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      p === "High"
                        ? "bg-rose-50 text-rose-500"
                        : p === "Medium"
                          ? "bg-amber-50 text-amber-500"
                          : "bg-emerald-50 text-emerald-500"
                    }`}
                  >
                    {p}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {tasks.filter((t) => t.priority === p).length} tasks
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown Card */}
          <div className="bg-white rounded-2rem border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-wider">
              By Category
            </h3>
            <div className="space-y-6">
              {["Work", "Personal", "General"].map((cat) => {
                const count = tasks.filter(
                  (t) => (t.category || "General") === cat,
                ).length;
                return (
                  <div
                    key={cat}
                    className="group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                      <span className="text-sm font-bold text-slate-600">
                        {cat}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
