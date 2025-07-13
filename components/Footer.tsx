
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, PRIMARY_COLOR, TEXT_COLOR } from '../constants';

const Footer: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <footer style={{ backgroundColor: PRIMARY_COLOR }} className="py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-black">
        <div className="flex justify-center items-center mb-2">
            {/* Simple text as logo for footer as well */}
            <p className="font-poppins text-xl font-bold">{APP_NAME}</p>
        </div>
        <p className="font-inter text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="font-inter text-xs mt-1">
          Platform Jastip Terpercaya Indonesia - Italia.
        </p>
        {!isAdminPage && (
          <div className="mt-4">
            <Link
              to="/admin/login"
              className="font-inter text-xs font-medium hover:underline"
              style={{ color: TEXT_COLOR }}
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
