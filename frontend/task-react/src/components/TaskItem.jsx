// TaskItem.jsx
import { useState } from "react";
import { EditIcon, TrashIcon, CheckIcon, XIcon, TagIcon, ClockIcon, CalendarIcon } from "./Icons";

export default function TaskItem({ 
  task, 
  onToggleDone, 
  onDelete, 
  onUpdate, 
  toggleBusyId, 
  deleteBusyId 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title || "");
  const [editCategory, setEditCategory] = useState(task.category || "");
  const [editEstimateHours, setEditEstimateHours] = useState(task.estimateHours || 0);
  const [editDueDate, setEditDueDate] = useState("");
  const [updating, setUpdating] = useState(false);

  // Initialize edit due date when starting edit
  const initializeEditDate = () => {
    const d = task.dueDate ? new Date(task.dueDate) : null;
    setEditDueDate(
      d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : ""
    );
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title || "");
    setEditCategory(task.category || "");
    setEditEstimateHours(task.estimateHours || 0);
    initializeEditDate();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title || "");
    setEditCategory(task.category || "");
    setEditEstimateHours(task.estimateHours || 0);
    setEditDueDate("");
  };

  const saveEdit = async () => {
    const errors = [];
    if (!editTitle.trim()) {
      errors.push("Title is required.");
    }
    if (!editCategory.trim()) {
      errors.push("Category is required.");
    }
    if (editEstimateHours < 0) {
      errors.push("Estimate hours must be non-negative.");
    }
    
    if (errors.length > 0) {
      return { errors };
    }

    try {
      setUpdating(true);
      const payload = {
        ...task,
        title: editTitle.trim(),
        dueDate: editDueDate ? editDueDate : null,
        category: editCategory.trim(),
        estimateHours: editEstimateHours,
      };
      
      await onUpdate(task.id, payload);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const rowBusy = toggleBusyId === task.id || deleteBusyId === task.id || updating;
  const isToggling = toggleBusyId === task.id;
  const isDeleting = deleteBusyId === task.id;

  return (
    <li className={`p-6 transition-all duration-200 ${task.isDone ? 'bg-gray-50' : 'hover:bg-gray-50'} ${rowBusy ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox with loading state */}
        <div className="flex items-center h-6 mt-1">
          {isToggling ? (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Updating...</span>
            </div>
          ) : (
            <input
              type="checkbox"
              checked={task.isDone}
              onChange={() => onToggleDone(task)}
              disabled={rowBusy || isEditing}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {!isEditing ? (
            <div className="space-y-3">
              <div className={`font-semibold text-lg ${task.isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                {task.title}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TagIcon />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                    task.category === 'Personal' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {task.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ClockIcon />
                  <span>{task.estimateHours}h</span>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {updating && (
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Saving changes...</span>
                </div>
              )}
              
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={updating}
                placeholder="Task title..."
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  disabled={updating}
                  placeholder="Category..."
                />
                
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={editEstimateHours}
                  onChange={(e) => setEditEstimateHours(Number(e.target.value))}
                  disabled={updating}
                  placeholder="Hours..."
                />
                
                <input
                  type="date"
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  disabled={updating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {!isEditing ? (
            <>
              <button
                onClick={startEdit}
                disabled={rowBusy}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Edit task"
              >
                <EditIcon />
              </button>
              
              {isDeleting ? (
                <div className="flex items-center gap-2 text-sm text-red-600 px-2">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Deleting...</span>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={rowBusy}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Delete task"
                >
                  <TrashIcon />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={saveEdit}
                disabled={updating}
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Save changes"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckIcon />
                )}
              </button>
              
              <button
                onClick={cancelEdit}
                disabled={updating}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Cancel editing"
              >
                <XIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}