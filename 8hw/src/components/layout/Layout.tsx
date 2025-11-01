import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;