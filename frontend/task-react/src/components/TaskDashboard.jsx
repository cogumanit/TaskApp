import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const sampleTasks = [
//   { id: 1, title: 'Design Landing Page', category: 'Work', estimateHours: 8, isDone: true, dueDate: '2025-10-01', priority: 'High' },
//   { id: 2, title: 'Fix Bug #123', category: 'Work', estimateHours: 2, isDone: true, dueDate: '2025-10-05', priority: 'Urgent' },
//   { id: 3, title: 'Update Documentation', category: 'Work', estimateHours: 4, isDone: false, dueDate: '2025-10-10', priority: 'Medium' },
//   { id: 4, title: 'Grocery Shopping', category: 'Personal', estimateHours: 1, isDone: false, dueDate: '2025-10-08', priority: 'Low' },
//   { id: 5, title: 'Gym Workout', category: 'Personal', estimateHours: 1.5, isDone: true, dueDate: '2025-10-06', priority: 'Medium' },
//   { id: 6, title: 'Team Meeting', category: 'Work', estimateHours: 2, isDone: false, dueDate: '2025-10-07', priority: 'High' },
// ];

const COLORS = {
  Work: '#3B82F6',
  Personal: '#10B981',
  Study: '#8B5CF6',
  Health: '#EF4444',
  priority: {
    Low: '#94A3B8',
    Medium: '#3B82F6',
    High: '#F59E0B',
    Urgent: '#EF4444'
  }
};

export default function TaskDashboard() {
  const [tasks] = useState(sampleTasks);

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isDone).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0);
  const completedHours = tasks.filter(t => t.isDone).reduce((sum, t) => sum + t.estimateHours, 0);

  // Tasks by category
  const categoryData = Object.entries(
    tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Tasks by priority
  const priorityData = Object.entries(
    tasks.reduce((acc, task) => {
      const priority = task.priority || 'Medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // const trendData = [
  //   { date: 'Mon', completed: 3, created: 5 },
  //   { date: 'Tue', completed: 5, created: 4 },
  //   { date: 'Wed', completed: 2, created: 6 },
  //   { date: 'Thu', completed: 4, created: 3 },
  //   { date: 'Fri', completed: 6, created: 5 },
  //   { date: 'Sat', completed: 1, created: 2 },
  //   { date: 'Sun', completed: 2, created: 1 },
  // ];

  // Hours by category
  const hoursData = Object.entries(
    tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + task.estimateHours;
      return acc;
    }, {})
  ).map(([category, hours]) => ({ category, hours }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Analytics Dashboard</h1>
          <p className="text-gray-600">Track your productivity and task insights</p>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            value={totalEstimatedHours}
            subtitle={`${completedHours}h completed`}
            icon="⏱️"
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Completion Trend */}
          <ChartCard title="Weekly Activity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
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
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
                <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Created" />
              </LineChart>
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

          {/* Tasks by Priority */}
          <ChartCard title="Tasks by Priority">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="name" type="category" stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.priority[entry.name] || '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="Most Productive Day"
            value="Friday"
            description="6 tasks completed"
            icon="🔥"
          />
          <InsightCard
            title="Average Task Duration"
            value={`${(totalEstimatedHours / totalTasks).toFixed(1)}h`}
            description="Per task estimate"
            icon="📊"
          />
          <InsightCard
            title="Upcoming Deadlines"
            value={pendingTasks}
            description="Tasks due this week"
            icon="🎯"
          />
        </div>
      </div>
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
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg p-6 text-white`}>
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InsightCard({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
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