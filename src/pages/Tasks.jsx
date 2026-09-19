import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask, getSubjects } from '../services/firestore';

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    priority: 'Medium',
    studyDate: '',
    startTime: '',
    endTime: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tasksData, subjectsData] = await Promise.all([
        getTasks(user.uid),
        getSubjects(user.uid)
      ]);
      setTasks(tasksData);
      setSubjects(subjectsData);
    } catch (err) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: '',
      subjectId: '',
      priority: 'Medium',
      studyDate: '',
      startTime: '',
      endTime: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subjectId) {
      return setError('Title and Subject are required.');
    }
    
    try {
      if (editingId) {
        await updateTask(editingId, formData);
      } else {
        await createTask(user.uid, formData);
      }
      resetForm();
      loadData(); // refresh
    } catch (err) {
      setError('Failed to save task.');
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      subjectId: task.subjectId,
      priority: task.priority,
      studyDate: task.studyDate,
      startTime: task.startTime,
      endTime: task.endTime
    });
    setEditingId(task.id);
    setIsAdding(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await deleteTask(id);
      loadData(); // refresh
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task.id, { status: newStatus });
      loadData(); // refresh
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Task
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{editingId ? 'Edit Task' : 'Add New Task'}</h2>
          
          {subjects.length === 0 ? (
            <div className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              ⚠️ You need to add a Subject first before creating a task.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select a Subject</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Date</label>
                <input
                  type="date"
                  value={formData.studyDate}
                  onChange={(e) => setFormData({...formData, studyDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  {editingId ? 'Update Task' : 'Save Task'}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-lg mb-2">✅ No tasks yet</p>
          <p className="text-gray-400 text-sm">
            Click the "Add Task" button above to create your first task.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className={`bg-white p-6 rounded-xl shadow-sm border ${task.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'completed'}
                      onChange={() => toggleStatus(task)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 ml-8">
                    <div className="flex items-center gap-1">
                      <span>📚</span> {getSubjectName(task.subjectId)}
                    </div>
                    {task.studyDate && (
                      <div className="flex items-center gap-1">
                        <span>📅</span> {task.studyDate}
                      </div>
                    )}
                    {(task.startTime || task.endTime) && (
                      <div className="flex items-center gap-1">
                        <span>⏰</span> {task.startTime || '?'} - {task.endTime || '?'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 md:ml-8 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 ml-8">
                  <button 
                    onClick={() => handleEdit(task)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
