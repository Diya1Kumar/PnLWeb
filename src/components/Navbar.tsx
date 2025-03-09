import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <Calculator className="w-8 h-8 text-blue-400" />
            <span>PnLAnalyser</span>
          </Link>
          
          {!isDashboard ? (
            <div className="flex items-center gap-6">

              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;