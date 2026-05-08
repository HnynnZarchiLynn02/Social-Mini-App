import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // 
import LogoutButton from './components/LogoutButton.jsx';

// Navigation Bar Component
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      
        <Link to="/home" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          SOCIAL<span className="text-gray-800">APP</span>
        </Link>

       
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link to="/home" className="hover:text-blue-600 transition">Feed</Link>
          <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          
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

// Authentication Guard Component
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
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Default & 404 Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold text-gray-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;