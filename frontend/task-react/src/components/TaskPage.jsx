// components/TaskPage.jsx
import { useEffect, useState } from "react";
import { api } from "../api";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import ErrorMessage from "./ErrorMessage";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);

  const [saving, setSaving] = useState(false);
  const [toggleBusyId, setToggleBusyId] = useState(null);
  const [deleteBusyId, setDeleteBusyId] = useState(null);

  async function loadTasks() {
    try {
      setError([]);
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError([err.message || "Failed to load tasks"]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleAddTask = async (taskData) => {
    try {
      setSaving(true);
      setError([]);
      await delay(2000);
      await api.createTask(taskData);
      await loadTasks();
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Failed to create task";
      setError([errorMsg]);
      return { success: false, errors: [errorMsg] };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError([]);
      setDeleteBusyId(id);
      await delay(1500);
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError([err.message || "Failed to delete task"]);
    } finally {
      setDeleteBusyId(null);
    }
  };

  const handleToggleDone = async (task) => {
    try {
      setError([]);
      setToggleBusyId(task.id);
      await delay(1000);
      await api.updateTask(task.id, { ...task, isDone: !task.isDone });
      await loadTasks();
    } catch (err) {
      setError([err.message || "Failed to update task"]);
    } finally {
      setToggleBusyId(null);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      setError([]);
      await delay(1500);
      await api.updateTask(id, updatedTask);
      await loadTasks();
    } catch (err) {
      setError([err.message || "Failed to update task"]);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">Tasks</h1>
            <p className="text-gray-600">Create a task and it will appear below.</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-8 space-y-8">
        <TaskForm onAddTask={handleAddTask} isLoading={saving} />
        <ErrorMessage errors={error} onDismiss={() => setError([])} />
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleDone={handleToggleDone}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
          toggleBusyId={toggleBusyId}
          deleteBusyId={deleteBusyId}
        />
      </main>
    </div>
  );
}
