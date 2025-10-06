import React, { useEffect, useState, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "./AuthContext";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import ErrorMessage from "./ErrorMessage";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  Work: '#3B82F6',
  Personal: '#10B981',
  Study: '#8B5CF6',
  Health: '#EF4444',
  Other: '#F59E0B'
};

export default function TaskPage() {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toggleBusyId, setToggleBusyId] = useState(null);
  const [deleteBusyId, setDeleteBusyId] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);

  async function loadTasks() {
    try {
      setError([]);
      setLoading(true);
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (err) {
      if (err.message?.includes("401")) logout();
      setError([err.message || "Failed to load tasks"]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleAddTask = async (taskData) => {
    try {
      setSaving(true);
      setError([]);
      await delay(1000);
      await api.createTask(taskData, token);
      await loadTasks();
      return { success: true };
    } catch (err) {
      const msg = err.message || "Failed to create task";
      setError([msg]);
      return { success: false, errors: [msg] };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError([]);
      setDeleteBusyId(id);
      await delay(1000);
      await api.deleteTask(id, token);
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
      await delay(800);
      await api.updateTask(task.id, { ...task, isDone: !task.isDone }, token);
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
      await delay(800);
      await api.updateTask(id, updatedTask, token);
      await loadTasks();
    } catch (err) {
      setError([err.message || "Failed to update task"]);
      throw err;
    }
  };

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isDone).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimateHours || 0), 0);
  const completedHours = tasks.filter(t => t.isDone).reduce((sum, t) => sum + (t.estimateHours || 0), 0);

  // Tasks by category
  const categoryData = Object.entries(
    tasks.reduce((acc, task) => {
      const category = task.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Hours by category
  const hoursData = Object.entries(
    tasks.reduce((acc, task) => {
      const category = task.category || 'Other';
      acc[category] = (acc[category] || 0) + (task.estimateHours || 0);
      return acc;
    }, {})
  ).map(([category, hours]) => ({ category, hours: parseFloat(hours.toFixed(1)) }));

  // Weekly trend - group by week day
  const getTrendData = () => {
    const today = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trendMap = {};

    // Initialize all days
    weekDays.forEach(day => {
      trendMap[day] = { date: day, completed: 0, pending: 0 };
    });

    // Count tasks by day
    tasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const dayName = weekDays[dueDate.getDay()];
        if (trendMap[dayName]) {
          if (task.isDone) {
            trendMap[dayName].completed++;
          } else {
            trendMap[dayName].pending++;
          }
        }
      }
    });

    return weekDays.map(day => trendMap[day]);
  };

  const trendData = getTrendData();

  // Completion status pie data
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks }
  ];

  const STATUS_COLORS = {
    'Completed': '#10B981',
    'Pending': '#F59E0B'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and track productivity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            {showDashboard ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Show Tasks
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Show Dashboard
              </>
            )}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-8 space-y-8">
        {showDashboard ? (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Tasks"
                value={totalTasks}
                icon="📋"
                color="blue"
              />
              <MetricCard
                title="Completed"
                value={completedTasks}
                subtitle={`${completionRate}% completion rate`}
                icon="✅"
                color="green"
              />
              <MetricCard
                title="Pending"
                value={pendingTasks}
                subtitle={`${pendingTasks} tasks remaining`}
                icon="⏳"
                color="yellow"
              />
              <MetricCard
                title="Total Hours"
                value={totalEstimatedHours.toFixed(1)}
                subtitle={`${completedHours.toFixed(1)}h completed`}
                icon="⏱️"
                color="purple"
              />
            </div>

            {/* Charts Grid */}
            {totalTasks > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Completion Status */}
                <ChartCard title="Task Completion Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Tasks by Category */}
                <ChartCard title="Tasks by Category">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8B5CF6'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Hours by Category */}
                <ChartCard title="Estimated Hours by Category">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hoursData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="category" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Weekly Distribution */}
                <ChartCard title="Tasks by Day of Week">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
                <p className="text-gray-600">Add some tasks to see your analytics dashboard</p>
              </div>
            )}

            {/* Additional Insights */}
            {totalTasks > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard
                  title="Average Task Duration"
                  value={totalTasks > 0 ? `${(totalEstimatedHours / totalTasks).toFixed(1)}h` : '0h'}
                  description="Per task estimate"
                  icon="📊"
                />
                <InsightCard
                  title="Most Used Category"
                  value={categoryData.length > 0 ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).name : 'N/A'}
                  description={categoryData.length > 0 ? `${categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).value} tasks` : 'No tasks yet'}
                  icon="🏷️"
                />
                <InsightCard
                  title="Completion Progress"
                  value={`${completedHours.toFixed(1)}/${totalEstimatedHours.toFixed(1)}h`}
                  description="Hours completed"
                  icon="🎯"
                />
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InsightCard({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}