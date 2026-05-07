import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; // ProfilePage ကို import လုပ်ပါ
import LogoutButton from './components/LogoutButton.jsx';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Profile Route ကို ထည့်သွင်းခြင်း */}
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/dashboard" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <h1 className="text-3xl font-bold mb-2">Welcome to Dashboard</h1>
                    <p className="mb-6 text-gray-600 font-medium">Logged in as: <span className="text-blue-600">{user?.username}</span></p>
                    
                    <div className="flex flex-col gap-3">
                        {/* Profile သို့သွားရန် Link ခလုတ် */}
                        <Link 
                            to="/profile" 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to Profile
                        </Link>
                        
                        <LogoutButton />
                    </div>
                </div>
            </div>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Page မရှိရင် ပြမယ့် Error Page (Optional) */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;