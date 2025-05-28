import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, PRIMARY_COLOR, BUTTON_COLOR, BUTTON_TEXT_COLOR, TEXT_COLOR } from '../../constants';
import LogoIcon from '../../components/icons/LogoIcon'; // Re-using the public logo

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(''); // Not used for auth, just for form feel
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate authentication
    if (password === 'admin123') { // Hardcoded password for demo
      login('fake-admin-token'); // Simulate token
      navigate(from, { replace: true });
    } else {
      setError('Password salah. Gunakan "admin123" untuk demo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8">
        <div style={{ backgroundColor: PRIMARY_COLOR }} className="p-3 rounded-lg inline-block">
            <h1 className="font-poppins text-4xl font-bold text-black">{APP_NAME}</h1>
        </div>
        <p className="text-center text-xl font-semibold text-black mt-2">Admin Panel</p>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="font-poppins text-2xl font-bold text-center text-black mb-6">Login Admin</h2>
        {error && <p className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter">
              Email (demo)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 font-inter">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-inter"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-300 font-inter"
              style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
            >
              Login
            </button>
            <Link
              to="/"
              className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-300 font-inter"
              style={{ borderColor: TEXT_COLOR, color: TEXT_COLOR, backgroundColor: 'white' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0';}}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white';}}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
       <p className="mt-6 text-xs text-gray-500 font-inter">
          Gunakan password `admin123` untuk login (demo).
        </p>
    </div>
  );
};

export default AdminLoginPage;