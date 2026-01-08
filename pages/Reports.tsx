
import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BarChart3, Download, FileText, Table, Filter, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const { students, payments, attendance, getStudentDue } = useLibrary();
  const [reportType, setReportType] = useState<'INCOME' | 'DUE' | 'ATTENDANCE'>('INCOME');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalDue = students.reduce((sum, s) => sum + getStudentDue(s.id), 0);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === 'INCOME') {
      csvContent += "Date,Student ID,Amount,Mode,Receipt\n";
      payments.forEach(p => csvContent += `${p.date},${p.studentId},${p.amount},${p.mode},${p.receiptNumber}\n`);
    } else if (reportType === 'DUE') {
      csvContent += "Student,ID,Seat,Due Amount\n";
      students.forEach(s => csvContent += `${s.fullName},${s.studentId},${s.seatNumber},${getStudentDue(s.id)}\n`);
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Report Switcher */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto">
            <button 
              onClick={() => setReportType('INCOME')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${reportType === 'INCOME' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Income
            </button>
            <button 
              onClick={() => setReportType('DUE')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${reportType === 'DUE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Due
            </button>
            <button 
              onClick={() => setReportType('ATTENDANCE')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${reportType === 'ATTENDANCE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Attendance
            </button>
         </div>

         <div className="flex gap-4 w-full md:w-auto">
            <button onClick={exportCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 transition-all">
               <Download size={18} /> Export CSV
            </button>
            <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-950 transition-all shadow-lg">
               <FileText size={18} /> Print PDF
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Total Collection</p>
            <p className="text-2xl font-black text-emerald-600">₹{totalIncome}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Outstanding Dues</p>
            <p className="text-2xl font-black text-rose-600">₹{totalDue}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Total Transactions</p>
            <p className="text-2xl font-black text-indigo-600">{payments.length}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Active Plans</p>
            <p className="text-2xl font-black text-sky-600">{students.filter(s => s.status === 'ACTIVE').length}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
         <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">{reportType} REPORT DATA</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
               <Calendar size={14} /> {new Date().toLocaleDateString()}
            </div>
         </div>
         
         <div className="overflow-x-auto">
            {reportType === 'INCOME' && (
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                     <tr>
                        <th className="px-6 py-4">Receipt</th>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Mode</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {payments.map(p => {
                        const student = students.find(s => s.id === p.studentId);
                        return (
                           <tr key={p.id} className="text-sm">
                              <td className="px-6 py-4 font-bold text-gray-400">{p.receiptNumber}</td>
                              <td className="px-6 py-4 font-black text-gray-700">{student?.fullName || '---'}</td>
                              <td className="px-6 py-4 text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black">{p.mode}</span></td>
                              <td className="px-6 py-4 text-right font-black text-emerald-600">₹{p.amount}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            )}

            {reportType === 'DUE' && (
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                     <tr>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Full Name</th>
                        <th className="px-6 py-4">Seat</th>
                        <th className="px-6 py-4">Total Plan</th>
                        <th className="px-6 py-4 text-right">Balance Due</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {students.filter(s => getStudentDue(s.id) > 0).map(s => (
                        <tr key={s.id} className="text-sm">
                           <td className="px-6 py-4 font-bold text-gray-400">{s.studentId}</td>
                           <td className="px-6 py-4 font-black text-gray-700">{s.fullName}</td>
                           <td className="px-6 py-4"><span className="font-bold text-indigo-600">{s.seatNumber || 'N/A'}</span></td>
                           <td className="px-6 py-4 text-gray-500 font-bold">₹{s.planFee}</td>
                           <td className="px-6 py-4 text-right font-black text-rose-600">₹{getStudentDue(s.id)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}

            {reportType === 'ATTENDANCE' && (
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                     <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Seat</th>
                        <th className="px-6 py-4">In Time</th>
                        <th className="px-6 py-4">Out Time</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {attendance.map(a => {
                        const student = students.find(s => s.id === a.studentId);
                        return (
                           <tr key={a.id} className="text-sm">
                              <td className="px-6 py-4 text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-black text-gray-700">{student?.fullName}</td>
                              <td className="px-6 py-4 font-bold text-indigo-500">{student?.seatNumber || 'N/A'}</td>
                              <td className="px-6 py-4 font-bold text-emerald-600">{a.inTime}</td>
                              <td className="px-6 py-4 font-bold text-gray-400">{a.outTime || '---'}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            )}
         </div>
      </div>
    </div>
  );
};

export default Reports;
