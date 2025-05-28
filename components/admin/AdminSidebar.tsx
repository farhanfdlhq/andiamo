import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, SECONDARY_COLOR, PRIMARY_COLOR, BUTTON_TEXT_COLOR } from '../../constants';
// Simple icons (could be replaced with actual SVG icons)
const DashboardIcon = () => <span className="mr-3">📊</span>;
const BatchIcon = () => <span className="mr-3">📦</span>;
const SettingsIcon = () => <span className="mr-3">⚙️</span>;
const LogoutIcon = () => <span className="mr-3">🚪</span>;


const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 group ${
      isActive 
        ? 'text-black' 
        : 'text-gray-300 hover:text-white'
    } ${ isActive ? 'font-bold' : ''}`;
  
  const activeStyle = {
    backgroundColor: PRIMARY_COLOR,
  };


  return (
    <div className="w-64 h-full flex flex-col" style={{ backgroundColor: SECONDARY_COLOR }}>
      <div className="px-6 py-5 flex items-center" style={{borderBottom: `1px solid ${PRIMARY_COLOR}40`}}>
        <h1 className="font-poppins text-xl font-bold" style={{ color: PRIMARY_COLOR }}>{APP_NAME}</h1>
        <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: PRIMARY_COLOR, color:SECONDARY_COLOR }}>ADMIN</span>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink 
            to="/admin/dashboard" 
            className={navLinkClasses}
            style={({ isActive }) => isActive ? activeStyle : {}}
        >
          <DashboardIcon /> Dashboard
        </NavLink>
        <NavLink 
            to="/admin/batches" 
            className={navLinkClasses}
            style={({ isActive }) => isActive ? activeStyle : {}}
        >
          <BatchIcon /> Kelola Batch
        </NavLink>
        <NavLink 
            to="/admin/settings" 
            className={navLinkClasses}
            style={({ isActive }) => isActive ? activeStyle : {}}
        >
          <SettingsIcon /> Pengaturan
        </NavLink>
      </nav>
      <div className="p-4 mt-auto border-t" style={{borderColor: `${PRIMARY_COLOR}40`}}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 group text-gray-300 hover:bg-red-500 hover:text-white"
        >
          <LogoutIcon /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
