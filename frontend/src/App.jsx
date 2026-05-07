import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx'; // Home (Feed) Page ကို Import လုပ်ပါ
import LogoutButton from './components/LogoutButton.jsx';

// Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးပေးမည့် Helper Component (Private Route)
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (Login ဝင်မှ ကြည့်လို့ရမည့် Page များ) */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome to Dashboard</h1>
                <p className="mb-6 text-gray-600 font-medium">
                  Logged in as: <span className="text-blue-600">
                    {JSON.parse(localStorage.getItem('user'))?.username || "Guest"}
                  </span>
                </p>
                <div className="flex flex-col gap-3">
                  <Link to="/home" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    Go to Feed (Home)
                  </Link>
                  <Link to="/profile" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Go to Profile
                  </Link>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* 404 Page */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl font-semibold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;