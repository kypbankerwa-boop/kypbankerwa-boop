
import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { ClipboardCheck, Search, LogIn, LogOut, CheckCircle2, User, QrCode, X, Camera, AlertTriangle, Clock } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Attendance: React.FC = () => {
  const { students, attendance, markAttendance, shifts } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<{ name: string; type: string } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTodayStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === today);
  };

  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
      return () => { if (scannerRef.current) scannerRef.current.clear().catch(e => {}); };
    }
  }, [isScannerOpen]);

  function onScanSuccess(decodedText: string) {
    const student = students.find(s => s.studentId === decodedText);
    if (student) {
      const status = getTodayStatus(student.id);
      const punchType = !status ? 'IN' : (!status.outTime ? 'OUT' : null);
      
      if (!punchType) {
        setScanError(`${student.fullName} already marked attendance for today.`);
        return;
      }

      const result = markAttendance(student.id, punchType);
      if (result.success) {
        setLastScanned({ name: student.fullName, type: punchType });
        setScanError(null);
        setTimeout(() => setLastScanned(null), 3000);
      } else {
        setScanError(result.message);
      }
    } else {
      setScanError("Student not found.");
    }
  }

  function onScanFailure(error: any) {}

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full md:w-auto flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search student ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none shadow-sm"
            />
          </div>
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider shadow-lg">
            <QrCode size={20} /> Scan QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-4">
            <h3 className="text-lg font-black text-gray-800 px-2 flex items-center gap-2">Today's Roster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {filteredStudents.map(student => {
                  const status = getTodayStatus(student.id);
                  const shift = shifts.find(sh => sh.id === student.shiftId);
                  return (
                    <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                       <div className="flex items-center gap-3">
                          <img src={student.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                          <div>
                             <p className="text-sm font-black text-gray-800">{student.fullName}</p>
                             <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                                <Clock size={10} className="text-indigo-400" /> {shift?.name}
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          {!status ? (
                             <button onClick={() => { const r = markAttendance(student.id, 'IN'); if(!r.success) alert(r.message); }} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase">
                                <LogIn size={14} /> Punch In
                             </button>
                          ) : !status.outTime ? (
                             <button onClick={() => markAttendance(student.id, 'OUT')} className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase">
                                <LogOut size={14} /> Punch Out
                             </button>
                          ) : (
                             <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase">
                                <CheckCircle2 size={14} /> Done
                             </div>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden h-full">
               <h3 className="text-xl font-black mb-6">Recent Feed</h3>
               <div className="space-y-4">
                  {attendance.filter(a => a.date === today).slice(-5).reverse().map(record => {
                     const student = students.find(s => s.id === record.studentId);
                     const shift = shifts.find(sh => sh.id === record.shiftId);
                     return (
                        <div key={record.id} className="border-l-2 border-indigo-700 pl-4 py-1">
                           <p className={`text-[9px] font-black uppercase ${record.outTime ? 'text-rose-300' : 'text-emerald-300'}`}>
                              {shift?.name} • {record.outTime ? 'Out' : 'In'}
                           </p>
                           <p className="text-sm font-bold">{student?.fullName}</p>
                           <p className="text-[10px] opacity-50">{record.outTime || record.inTime}</p>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>

      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-900 text-white">
              <h3 className="text-2xl font-black">Scanner Active</h3>
              <button onClick={() => setIsScannerOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={32} /></button>
            </div>
            <div className="p-8">
              <div id="reader" className="w-full border-4 border-indigo-50 rounded-3xl shadow-inner aspect-square overflow-hidden"></div>
              <div className="mt-8 space-y-4 min-h-[80px]">
                {lastScanned && (
                  <div className={`p-5 rounded-2xl flex items-center gap-4 ${lastScanned.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    <CheckCircle2 size={32} />
                    <div>
                      <p className="text-lg font-black uppercase">{lastScanned.name}</p>
                      <p className="text-[10px] font-black uppercase opacity-60">Punched {lastScanned.type} Successfully</p>
                    </div>
                  </div>
                )}
                {scanError && (
                  <div className="p-5 bg-amber-50 text-amber-700 rounded-2xl flex items-center gap-4">
                    <AlertTriangle size={32} className="text-amber-500" />
                    <p className="text-sm font-black">{scanError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
