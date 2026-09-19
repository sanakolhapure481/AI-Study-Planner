import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // If user is not logged in, we do not render the navbar
  if (!user) return null;

  // Helper to highlight the active navigation link
  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* App Logo / Title */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            📖 AI Study Planner
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">

            <Link to="/" className={linkClass('/')}>
              Dashboard
            </Link>

            <Link to="/subjects" className={linkClass('/subjects')}>
              Subjects
            </Link>

            <Link to="/tasks" className={linkClass('/tasks')}>
              Tasks
            </Link>

            <Link to="/schedule" className={linkClass('/schedule')}>
              Schedule
            </Link>

            <Link
              to="/ai-recommendations"
              className={linkClass('/ai-recommendations')}
            >
              🤖 AI Recommendations
            </Link>

          </div>

          {/* Logout Button */}
          <div className="flex items-center space-x-4">

            <span className="text-sm text-gray-500 hidden sm:block">
              {user.displayName || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">

          <Link to="/" className={linkClass('/')}>
            Dashboard
          </Link>

          <Link to="/subjects" className={linkClass('/subjects')}>
            Subjects
          </Link>

          <Link to="/tasks" className={linkClass('/tasks')}>
            Tasks
          </Link>

          <Link to="/schedule" className={linkClass('/schedule')}>
            Schedule
          </Link>

          <Link
            to="/ai-recommendations"
            className={linkClass('/ai-recommendations')}
          >
            🤖 AI
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;