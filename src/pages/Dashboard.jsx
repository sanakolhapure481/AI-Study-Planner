import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getSubjects } from '../services/firestore';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todaysTasks: 0,
    progressPercentage: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [tasks, subjects] = await Promise.all([
          getTasks(user.uid),
          getSubjects(user.uid)
        ]);
        
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = totalTasks - completedTasks;
        const todaysTasks = tasks.filter(t => t.studyDate === today).length;
        
        // Prevent divide-by-zero
        const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        setStats({
          totalSubjects: subjects.length,
          totalTasks,
          completedTasks,
          pendingTasks,
          todaysTasks,
          progressPercentage
        });
        
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        setError('Failed to load your progress.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Subjects</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalSubjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Completed Tasks</p>
          <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pending Tasks</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Progress Bar Container */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Overall Progress
          </h2>
          <p className="text-sm text-gray-500 mb-4">Your completion rate across all subjects</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Completion</span>
            <span className="text-sm font-bold text-blue-600">{stats.progressPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${stats.progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-right">
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </p>
        </div>

        {/* Today's Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            📅 Today's Schedule
          </h2>
          <p className="text-sm text-gray-500 mb-4">Tasks assigned for today</p>
          
          <div className="flex items-center justify-center h-24">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-1">{stats.todaysTasks}</p>
              <p className="text-sm text-gray-500">Tasks scheduled for today</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          🤖 AI Study Recommendations
        </h2>
        <p className="text-gray-500">
          Gemini AI recommendations will be available in Phase 6.
        </p>
      </div>
    </div>
  )
}

export default Dashboard;
