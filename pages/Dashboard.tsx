
import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import StatCard from '../components/StatCard';
import { Users, UserCheck, UserMinus, IndianRupee, PieChart, Timer, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MembershipStatus } from '../types';

const Dashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { students, payments, seats, attendance, getStudentDue } = useLibrary();

  const activeCount = students.filter(s => s.status === MembershipStatus.ACTIVE).length;
  const expiredCount = students.filter(s => s.status === MembershipStatus.EXPIRED).length;
  const totalDue = students.reduce((sum, s) => sum + getStudentDue(s.id), 0);
  
  const currentMonth = new Date().getMonth();
  const monthlyIncome = payments
    .filter(p => new Date(p.date).getMonth() === currentMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  const seatUtilization = seats.length > 0 ? (seats.filter(s => s.status === 'OCCUPIED').length / seats.length) * 100 : 0;

  const chartData = [
    { name: 'Total', value: students.length, color: '#6366f1' },
    { name: 'Active', value: activeCount, color: '#10b981' },
    { name: 'Expired', value: expiredCount, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          label="Total Students" 
          value={students.length} 
          icon={<Users size={24} />} 
          color="bg-indigo-500"
          onClick={() => onNavigate('students')}
        />
        <StatCard 
          label="Active Members" 
          value={activeCount} 
          icon={<UserCheck size={24} />} 
          color="bg-emerald-500"
          onClick={() => onNavigate('students')}
        />
        <StatCard 
          label="Expired Members" 
          value={expiredCount} 
          icon={<UserMinus size={24} />} 
          color="bg-rose-500"
          onClick={() => onNavigate('students')}
        />
        <StatCard 
          label="Total Due" 
          value={`₹${totalDue}`} 
          icon={<AlertCircle size={24} />} 
          color="bg-amber-500"
          onClick={() => onNavigate('reports')}
        />
        <StatCard 
          label="Monthly Income" 
          value={`₹${monthlyIncome}`} 
          icon={<IndianRupee size={24} />} 
          color="bg-sky-500"
          onClick={() => onNavigate('payments')}
        />
        <StatCard 
          label="Seat Utilization" 
          value={`${seatUtilization.toFixed(1)}%`} 
          icon={<PieChart size={24} />} 
          color="bg-violet-500"
          onClick={() => onNavigate('seat-map')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Enrollment Overview</h3>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Real-time</span>
          </div>
          {/* Fix: Added min-w-0 and ensured definite width to resolve ResponsiveContainer -1 dimension error */}
          <div className="h-64 w-full min-w-0 relative">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Today's Presence</h3>
            <button onClick={() => onNavigate('attendance')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="flex-1 space-y-4">
            {attendance.slice(-5).reverse().map((record) => {
              const student = students.find(s => s.id === record.studentId);
              return (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={student?.photoUrl || 'https://picsum.photos/40/40'} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{student?.fullName || 'Unknown Student'}</p>
                      <p className="text-xs text-gray-500">Seat: {student?.seatNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{record.inTime}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">{record.outTime ? `Out: ${record.outTime}` : 'Ongoing'}</p>
                  </div>
                </div>
              );
            })}
            {attendance.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                <Timer size={48} className="mb-2 opacity-20" />
                <p className="text-sm">No activity recorded today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
