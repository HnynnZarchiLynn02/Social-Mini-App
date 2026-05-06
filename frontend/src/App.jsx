import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LogoutButton from './components/LogoutButton.jsx';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <h1 className="text-3xl font-bold mb-4">Welcome to User Dashboard</h1>
                <p className="mb-6 text-gray-600">Logged in as: {user?.username}</p>
                <LogoutButton />
            </div>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;