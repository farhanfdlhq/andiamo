import React from 'react';
import SettingsForm from '../../components/admin/SettingsForm';

const AdminSettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="font-poppins text-3xl font-bold text-black mb-8">Pengaturan Aplikasi</h1>
      <SettingsForm />
    </div>
  );
};

export default AdminSettingsPage;
