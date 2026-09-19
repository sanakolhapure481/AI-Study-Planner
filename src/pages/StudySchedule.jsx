import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../services/firestore';

function StudySchedule() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        const data = await getTasks(user.uid);

        // Show only tasks that have a date and time
        const scheduledTasks = data
          .filter(task => task.studyDate && task.startTime && task.endTime)
          .sort((a, b) => {
            const dateA = `${a.studyDate} ${a.startTime}`;
            const dateB = `${b.studyDate} ${b.startTime}`;

            return dateA.localeCompare(dateB);
          });

        setTasks(scheduledTasks);
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load study schedule.');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [user]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Study Schedule
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Study Schedule
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-lg mb-2">
            📅 No scheduled sessions yet
          </p>

          <p className="text-gray-400 text-sm">
            Add a task with a study date, start time and end time to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    📅 {task.studyDate}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    ⏰ {task.startTime} - {task.endTime}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span
                  className={`text-sm font-medium ${
                    task.status === 'completed'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {task.status === 'completed'
                    ? '✅ Completed'
                    : '⏳ Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudySchedule;