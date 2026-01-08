
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, onClick, trend }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
          <div className={`${color.replace('bg-', 'text-')}`}>
            {icon}
          </div>
        </div>
        {trend && (
           <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
