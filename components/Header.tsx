
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, PRIMARY_COLOR } from '../constants';
import LogoIcon from './icons/LogoIcon';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: PRIMARY_COLOR }} className="py-4 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          {/* Using a simpler text logo for better control with Tailwind font */}
          <div style={{ backgroundColor: PRIMARY_COLOR }} className="p-0">
             <h1 className="font-poppins text-3xl font-bold text-black">{APP_NAME}</h1>
          </div>
        </Link>
        <nav>
          {/* Future navigation links can go here */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
