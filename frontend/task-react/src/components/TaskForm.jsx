// TaskForm.jsx
import { useState } from "react";
import { PlusIcon, TagIcon, ClockIcon, CalendarIcon } from "./Icons";

export default function TaskForm({ onAddTask, isLoading }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [estimateHours, setEstimateHours] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = [];
    if (!title.trim()) {
      validationErrors.push("Title is required.");
    }
    if (!category.trim()) {
      validationErrors.push("Category is required.");
    }
    if (estimateHours < 0) {
      validationErrors.push("Estimate hours must be non-negative.");
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return { errors: validationErrors };
    }

    // Clear errors if validation passes
    setErrors([]);

    const taskData = {
      title: title.trim(),
      isDone: false,
      dueDate: dueDate || null,
      category: category.trim(),
      estimateHours: estimateHours,
    };

    try {
      const result = await onAddTask(taskData);
      
      if (result?.success) {
        // Reset form on success
        setTitle("");
        setDueDate("");
        setCategory("");
        setEstimateHours(0);
        setErrors([]);
      } else if (result?.errors) {
        // Handle errors from the parent component
        setErrors(result.errors);
      }
      
      return result;
    } catch (error) {
      // Handle any thrown errors
      const errorMessage = error.message || "An unexpected error occurred.";
      setErrors([errorMessage]);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PlusIcon />
        Add New Task
      </h2>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.some(error => error.includes('Title')) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <TagIcon />
              Category *
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.some(error => error.includes('Category')) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Work, Personal..."
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <ClockIcon />
              Hours *
            </label>
            <input
              type="number"
              min=""
              step="1"
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.some(error => error.includes('hours')) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              value={estimateHours}
              onChange={(e) => setEstimateHours(Number(e.target.value))}
              placeholder=""
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <CalendarIcon />
              Due Date
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 min-w-32 justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <PlusIcon />
                Add Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}