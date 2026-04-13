import React, { useState } from "react";
import { Filter, Tag, CheckCircle } from "lucide-react";

export default function Completed({ tasks }) {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Filter Logic: Only completed tasks + user-selected filters
  const filteredTasks = tasks.filter((task) => {
    const isCompleted = task.status === "completed";
    const matchPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    const matchCategory =
      categoryFilter === "All" ||
      (task.category || "General") === categoryFilter;
    return isCompleted && matchPriority && matchCategory;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            
          </h2>
          <p className="text-slate-400 font-medium mt-1">Your finished tasks</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            icon={<Filter size={14} />}
            options={["All", "High", "Medium", "Low"]}
            active={priorityFilter}
            setActive={setPriorityFilter}
          />
          <FilterBar
            icon={<Tag size={14} />}
            options={["All", "Work", "Personal", "General"]}
            active={categoryFilter}
            setActive={setCategoryFilter}
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center p-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <CheckCircle className="text-slate-200" size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-400 tracking-tight">
            {tasks.some((t) => t.status === "completed")
              ? "No tasks match these filters."
              : "No completed tasks yet. Keep going!"}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((t) => (
            <div
              key={t._id || t.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm opacity-70"
            >
              <div className="flex items-center gap-4">
                <CheckCircle className="text-emerald-500" size={24} />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-through">
                    {t.title}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {t.priority}
                    </span>
                    <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {t.category || "General"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable FilterBar helper
function FilterBar({ icon, options, active, setActive }) {
  return (
    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
      <div className="px-2.5 border-r border-slate-100 text-slate-400">
        {icon}
      </div>
      <div className="flex gap-1 px-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setActive(opt)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              active === opt
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
