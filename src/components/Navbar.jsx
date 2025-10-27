import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [logoutMsg, setLogoutMsg] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post('/api/auth/logout', {}, { withCredentials: true });
      console.log('User successfully logout');
      setAuth(null);
      localStorage.removeItem('auth');
      toast.success('Successfully logged out!');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setAuth(null);
      localStorage.removeItem('auth');
      toast.error('Logged out due to error');
      navigate('/login');
    }
    setShowLogoutModal(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            Home
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col space-y-1"
          >
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {auth?.accessToken ? (
              <>
                {auth.user?.role === 'admin' ? (
                  <Link to="/admin" className="hover:text-gray-300">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/tasks" className="hover:text-gray-300">
                    My Tasks
                  </Link>
                )}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {auth?.accessToken ? (
              <>
                {auth.user?.role === 'admin' ? (
                  <Link 
                    to="/admin" 
                    className="block py-2 hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/tasks" 
                    className="block py-2 hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Tasks
                  </Link>
                )}
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 bg-red-600 px-3 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </nav>
  );
};

export default Navbar;
