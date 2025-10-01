// TaskList.jsx
import TaskItem from "./TaskItem";
import { DownloadIcon } from "./Icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TaskList({ 
  tasks, 
  loading, 
  onToggleDone, 
  onDelete, 
  onUpdate, 
  toggleBusyId, 
  deleteBusyId 
}) {
  // sort tasks: pending first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // pending first (false < true)
    if (a.isDone !== b.isDone) return a.isDone - b.isDone;
    // then by due date (nulls last)
    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return ad - bd;
  });

  const exportToExcel = () => {
    const exportData = tasks.map(task => ({
      Title: task.title,
      Category: task.category,
      'Estimated Hours': task.estimateHours,
      'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
      Status: task.isDone ? 'Completed' : 'Pending'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `tasks-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const pendingCount = sortedTasks.filter(t => !t.isDone).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-center py-12 text-gray-600">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-lg font-medium">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Tasks ({pendingCount} pending)
        </h2>
        
        <button
          onClick={exportToExcel}
          disabled={tasks.length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 text-sm"
        >
          <DownloadIcon />
          Export to Excel
        </button>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 text-gray-300 mx-auto mb-4 flex items-center justify-center">
          </div>
          <p className="text-gray-500 text-lg">No tasks found.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
              onUpdate={onUpdate}
              toggleBusyId={toggleBusyId}
              deleteBusyId={deleteBusyId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}