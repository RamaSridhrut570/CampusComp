
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-md p-4 sm:px-6 lg:px-8 border-b border-slate-700">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
    </header>
  );
};

export default Header;
