import React, { useState } from "react";
import {
  Filter,
  Tag,
  CheckCircle,
  Edit3,
  Trash2,
  Circle,
  Calendar,
  Clock,
} from "lucide-react";

/**
 * AllTasks Component
 * Handles filtering and display of the full task list.
 */
export default function AllTasks({ tasks = [], onDelete, onEdit, onToggle }) {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Logic to handle potential non-array inputs and perform multi-point filtering
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        if (!task) return false;
        const matchPriority =
          priorityFilter === "All" || task.priority === priorityFilter;
        const matchCategory =
          categoryFilter === "All" ||
          (task.category || "General") === categoryFilter;
        return matchPriority && matchCategory;
      })
    : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header & Filter Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            Every task in your workspace
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

      {/* Main Task List Card */}
      <div className="bg-white rounded-2rem md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-450px flex flex-col">
        {filteredTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <CheckCircle className="text-slate-200" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-400 tracking-tight">
              No tasks match these filters.
            </h3>
          </div>
        ) : (
          <div className="p-4 md:p-8 space-y-3 w-full">
            {filteredTasks.map((task) => {
              const taskId = task._id || task.id;
              if (!taskId) return null;
              const isCompleted = task.status === "completed";

              return (
                <div
                  key={taskId}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm gap-4"
                >
                  <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => onToggle && onToggle(taskId, task.status)}
                      className={`mt-1 md:mt-0 transition-all shrink-0 active:scale-90 ${
                        isCompleted
                          ? "text-emerald-500"
                          : "text-slate-300 hover:text-blue-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle
                          size={22}
                          fill="currentColor"
                          className="fill-emerald-50"
                        />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3
                        className={`font-bold text-slate-800 text-sm md:text-base tracking-tight truncate transition-all ${
                          isCompleted
                            ? "line-through opacity-40 translate-x-1"
                            : ""
                        }`}
                      >
                        {task.title || "Untitled Task"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            task.priority === "High"
                              ? "bg-rose-100 text-rose-600"
                              : task.priority === "Medium"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {task.priority || "Low"}
                        </span>

                        {/* Category Tag */}
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {task.category || "General"}
                        </span>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-300" />
                            <span className="whitespace-nowrap">
                              {task.dueDate || "No Date"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-300" />
                            <span className="whitespace-nowrap">
                              {task.dueTime || "No Time"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Hover / Mobile Visible Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit && onEdit(task)}
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm md:shadow-none"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(taskId)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm md:shadow-none"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * FilterBar Sub-component
 * Provides a pill-style selection for different filter types.
 */
function FilterBar({ icon, options, active, setActive }) {
  return (
    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
      <div className="px-2.5 border-r border-slate-100 text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="flex gap-1 px-1 overflow-x-auto no-scrollbar">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setActive(opt)}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap ${
              active === opt
                ? "bg-slate-800 text-white shadow-md scale-105"
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
