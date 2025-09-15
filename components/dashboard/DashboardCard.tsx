
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, icon, color, onClick }) => {
  return (
    <div 
        className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-6 cursor-pointer hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1"
        onClick={onClick}
    >
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
