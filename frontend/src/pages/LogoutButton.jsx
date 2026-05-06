import { authService } from '../services/authService';

export const LogoutButton = () => {
    return (
        <button 
            onClick={() => authService.logout()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
            Logout
        </button>
    );
};