import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import StudySchedule from './pages/StudySchedule';
import AIRecommendations from './pages/AIRecommendations';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/subjects"
                element={
                  <PrivateRoute>
                    <Subjects />
                  </PrivateRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <Tasks />
                  </PrivateRoute>
                }
              />

              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <StudySchedule />
                  </PrivateRoute>
                }
              />

              {/* AI Recommendations */}
              <Route
                path="/ai-recommendations"
                element={
                  <PrivateRoute>
                    <AIRecommendations />
                  </PrivateRoute>
                }
              />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;