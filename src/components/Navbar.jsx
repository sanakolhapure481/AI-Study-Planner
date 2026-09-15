import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  // Helper to highlight the active navigation link
  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`

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
          </div>

          {/* Logout Button — will be connected to Firebase in Phase 2 */}
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
            Logout
          </button>
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
