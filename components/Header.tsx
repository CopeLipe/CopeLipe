import React from 'react';

interface HeaderProps {
    title: string;
    icon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
  return (
    <header className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
        {icon}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;