import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';
import LogoutButton from './components/LogoutButton.jsx';

// Navigation Bar Component
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          SOCIAL<span className="text-gray-800">APP</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link to="/home" className="hover:text-blue-600 transition">Feed</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-800">{user?.username || "Guest"}</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

// Protected Route Wrapper (Layout ပါ တစ်ခါတည်း ထည့်ပေးထားသည်)
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-6">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
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
            <div className="px-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">User Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Welcome back,</p>
                  <h2 className="text-xl font-bold text-blue-600">{JSON.parse(localStorage.getItem('user'))?.username}</h2>
                </div>
                {/* Links Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                   <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">→ Go to News Feed</Link>
                   <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">→ Edit Profile Settings</Link>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;