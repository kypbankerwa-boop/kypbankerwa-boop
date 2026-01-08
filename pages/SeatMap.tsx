
import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { MapPin, User, CheckCircle2, AlertCircle, Eye, Settings, X, Save, History, ShieldAlert, Clock } from 'lucide-react';
import { UserRole } from '../types';

const SeatMap: React.FC<{ onViewStudent: (id: string) => void }> = ({ onViewStudent }) => {
  const { seats, students, currentUser, updateSeatCount, seatLogs, shifts } = useLibrary();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newSeatCount, setNewSeatCount] = useState(seats.length);
  const [selectedShiftId, setSelectedShiftId] = useState(shifts[0]?.id || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const currentShiftSeats = useMemo(() => {
    return seats.map(seat => {
      const occupyingStudent = students.find(s => s.shiftId === selectedShiftId && s.seatNumber === seat.number);
      return {
        ...seat,
        status: occupyingStudent ? 'OCCUPIED' : 'VACANT',
        studentId: occupyingStudent ? occupyingStudent.id : null
      };
    });
  }, [seats, students, selectedShiftId]);

  const occupiedCount = currentShiftSeats.filter(s => s.status === 'OCCUPIED').length;
  const vacantCount = currentShiftSeats.filter(s => s.status === 'VACANT').length;

  const handleUpdateCount = () => {
    if (newSeatCount < 1) {
      setFeedback({ type: 'error', message: 'Seat count must be at least 1.' });
      return;
    }
    const result = updateSeatCount(newSeatCount);
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="space-y-8">
      {/* Shift Selector & Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-8 w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Active Shift</p>
              <select 
                value={selectedShiftId} 
                onChange={(e) => setSelectedShiftId(e.target.value)}
                className="bg-transparent font-black text-gray-800 text-sm outline-none cursor-pointer"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.isActive ? '' : '(Inactive)'}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-black text-emerald-600">{vacantCount}</p>
                <p className="text-[10px] font-black uppercase text-gray-400">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-black text-indigo-600">{occupiedCount}</p>
                <p className="text-[10px] font-black uppercase text-gray-400">Occupied</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {isAdmin && (
            <button 
              onClick={() => {
                setNewSeatCount(seats.length);
                setIsSettingsOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-xl hover:bg-indigo-950 transition-all shadow-lg shadow-indigo-900/20 font-black text-sm uppercase tracking-wider"
            >
              <Settings size={18} /> Configure
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {currentShiftSeats.map((seat) => {
          const student = students.find(s => s.id === seat.studentId);
          const isSelected = selectedSeat === seat.number;
          
          return (
            <div 
              key={seat.id}
              onClick={() => setSelectedSeat(seat.number === selectedSeat ? null : seat.number)}
              className={`relative h-24 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                seat.status === 'OCCUPIED' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'bg-white border-emerald-100 text-emerald-600 hover:border-emerald-300'
              } ${isSelected ? 'ring-4 ring-indigo-500 ring-offset-2 scale-105 z-10' : ''}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{seat.number}</span>
              {seat.status === 'OCCUPIED' && <User size={16} className="mt-1" />}
              {seat.status === 'VACANT' && <CheckCircle2 size={16} className="mt-1 opacity-20" />}
              
              {isSelected && seat.status === 'OCCUPIED' && student && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in zoom-in-95 duration-200">
                  <div className="flex flex-col items-center text-center">
                    <img src={student.photoUrl} className="w-12 h-12 rounded-full mb-2 border-2 border-indigo-50" alt="" />
                    <p className="text-sm font-black text-gray-800">{student.fullName}</p>
                    <p className="text-[10px] text-indigo-500 font-bold mb-3">{student.studentId}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewStudent(student.id); }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-[10px] font-black uppercase py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Eye size={12} /> Full Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-900 text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Capacity Config</h3>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-1">Manage physical library seats</p>
              </div>
              <button onClick={() => { setIsSettingsOpen(false); setFeedback(null); }} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                <X size={32} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Settings size={20} />
                   </div>
                   <h4 className="font-black text-gray-800 uppercase tracking-tight">Capacity Settings</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 block mb-1">Total Physical Seats</label>
                      <p className="text-[10px] text-gray-500 leading-none">Global count across all shifts</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1"
                        value={newSeatCount}
                        onChange={(e) => setNewSeatCount(parseInt(e.target.value) || 0)}
                        className="w-24 p-3 bg-white border border-gray-200 rounded-xl font-black text-center text-indigo-600 outline-none"
                      />
                      <button 
                        onClick={handleUpdateCount}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-black text-xs uppercase"
                      >
                        <Save size={16} /> Apply
                      </button>
                    </div>
                  </div>
                  {feedback && (
                    <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top duration-300 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{feedback.message}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-black text-gray-800 uppercase tracking-tight text-sm px-2">Recent Changes</h4>
                <div className="space-y-2">
                  {seatLogs.map(log => (
                    <div key={log.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                       <div>
                          <p className="text-xs font-black text-gray-800">Count: {log.prevCount} → {log.newCount}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{log.adminName} • {new Date(log.timestamp).toLocaleDateString()}</p>
                       </div>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${log.newCount > log.prevCount ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {log.newCount > log.prevCount ? 'Increased' : 'Decreased'}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
