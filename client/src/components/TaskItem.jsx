import React from "react";
import { Trash2, CheckCircle2, Clock, Edit3, CalendarPlus } from "lucide-react";

export default function TaskItem({
  task,
  onDelete,
  onComplete,
  onEdit,
  onExtend,
}) {
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2rem group transition-all ${isCompleted ? "opacity-60 bg-slate-50" : "hover:shadow-md hover:border-blue-100"}`}
    >
      {/* COMPLETE BUTTON */}
      <button
        onClick={() => onComplete(task._id, task.status)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
          isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-slate-200 text-transparent hover:border-blue-500"
        }`}
      >
        <CheckCircle2 size={16} />
      </button>

      <div className="flex-1 min-w-0 text-left">
        <h4
          className={`font-bold text-slate-700 truncate ${isCompleted ? "line-through text-slate-400" : ""}`}
        >
          {task.title}
        </h4>
        <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {task.dueTime || "No Time"}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md ${
              task.category === "Work"
                ? "bg-blue-50 text-blue-500"
                : task.category === "Personal"
                  ? "bg-purple-50 text-purple-500"
                  : "bg-amber-50 text-amber-500"
            }`}
          >
            {task.category || "General"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isCompleted && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
            >
              <Edit3 size={18} />
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
