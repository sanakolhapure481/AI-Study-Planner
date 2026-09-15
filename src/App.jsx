import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Subjects from './pages/Subjects'
import Tasks from './pages/Tasks'
import StudySchedule from './pages/StudySchedule'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/*
          The Navbar is shown on all pages.
          In Phase 2, we will hide it on Login/Register pages
          and show it only when the user is logged in.
        */}
        <Navbar />

        {/* Main content area with padding */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public routes (no login required for now) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes (will require login in Phase 2) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/schedule" element={<StudySchedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
