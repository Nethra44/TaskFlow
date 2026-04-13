import React, { useState } from "react";
import { Filter, Tag, CheckCircle } from "lucide-react";
import TaskItem from "../components/TaskItem";

export default function Upcoming({ tasks = [], onDelete, onToggle, onExtend }) {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Get current date string for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        if (!task) return false;

        // SAFE DATE CHECK: Handle missing or malformed dueDates
        const taskDate = task.dueDate ? task.dueDate.split("T")[0] : "";
        const isUpcoming = taskDate > todayStr;

        const matchPriority =
          priorityFilter === "All" || task.priority === priorityFilter;
        const matchCategory =
          categoryFilter === "All" ||
          (task.category || "General") === categoryFilter;

        return isUpcoming && matchPriority && matchCategory;
      })
    : [];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            Tasks for the following days
          </p>
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

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center p-20 min-h-400px">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <CheckCircle className="text-slate-200" size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-400 tracking-tight text-center">
              No upcoming tasks this week.
            </h3>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <TaskItem
              key={t._id || t.id}
              task={t}
              onDelete={onDelete}
              onComplete={onToggle}
              onExtend={onExtend}
            />
          ))
        )}
      </div>
    </div>
  );
}

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
