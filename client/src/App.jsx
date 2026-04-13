import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Plus, X } from "lucide-react";

// Views
import Dashboard from "./views/Dashboard";
import AllTasks from "./views/AllTasks";
import Today from "./views/Today";
import Upcoming from "./views/Upcoming";
import Completed from "./views/Completed";
import Settings from "./views/Settings";

// Components
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("userId"),
  );
  const [currentView, setCurrentView] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("General");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchMyTasks = async () => {
    const currentId = localStorage.getItem("userId");
    if (!currentId) return;
    try {
      const res = await axios.get(
        `https://task-flow-sog6.vercel.app/api/tasks/${currentId}`,
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchMyTasks();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;

    const taskData = {
      title: newTaskTitle,
      priority: newPriority,
      category: newCategory,
      dueDate: newDate,
      dueTime: newTime,
      status: editingTask ? editingTask.status : "pending",
      userId: currentUserId,
    };

    try {
      if (editingTask) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingTask._id}`,
          taskData,
        );
      } else {
        await axios.post("http://localhost:5000/api/tasks", taskData);
      }
      closeModal();
      fetchMyTasks();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
    );
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status: newStatus,
      });
    } catch (err) {
      fetchMyTasks();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewPriority(task.priority || "Medium");
    setNewCategory(task.category || "General");
    setNewDate(task.dueDate || "");
    setNewTime(task.dueTime || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle("");
    setNewPriority("Medium");
    setNewCategory("General");
    setNewDate("");
    setNewTime("");
  };

  const renderView = () => {
    const props = {
      tasks,
      onDelete: handleDelete,
      onToggle: handleToggle,
      onEdit: handleEdit,
      setView: setCurrentView,
    };

    switch (currentView) {
      case "Dashboard":
        return <Dashboard {...props} />;
      case "All Tasks":
        return <AllTasks {...props} />;
      case "Today":
        return <Today {...props} />;
      case "Upcoming":
        return <Upcoming {...props} />;
      case "Completed":
        return <Completed {...props} />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard {...props} />;
    }
  };

  if (!isAuthenticated)
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-64 p-6 md:p-14">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white border rounded-2xl"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {currentView}
            </h1>
          </div>

          {/* New Task Button - Hidden on Settings Page */}
          {currentView !== "Settings" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-transform active:scale-95"
            >
              <Plus size={18} strokeWidth={4} />
              <span>New Task</span>
            </button>
          )}
        </header>

        <div className="max-w-7xl mx-auto">{renderView()}</div>

        {/* Modal Logic */}
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                onClick={closeModal}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-600"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black text-slate-800 mb-8 text-center uppercase tracking-tighter">
                {editingTask ? "Update Task" : "New Task"}
              </h2>

              <form onSubmit={handleSaveTask} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Task Title
                  </label>
                  <input
                    required
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category
                  </label>
                  <div className="flex gap-2 mt-1">
                    {["General", "Work", "Personal"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat)}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newCategory === cat ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-slate-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Priority
                  </label>
                  <div className="flex gap-2 mt-1">
                    {["High", "Medium", "Low"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newPriority === p ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl transition-all active:scale-95"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
