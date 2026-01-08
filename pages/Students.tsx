
import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { MembershipStatus, Student } from '../types';
import { Search, Plus, Eye, MapPin, IndianRupee, Users, Clock } from 'lucide-react';
import { PLANS } from '../constants';

const Students: React.FC<{ onViewProfile: (id: string) => void }> = ({ onViewProfile }) => {
  const { students, seats, shifts, addStudent, deleteStudent } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    planDurationMonths: 1,
    joiningDate: new Date().toISOString().split('T')[0],
    shiftId: shifts[0]?.id || '',
  });

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobile.includes(searchTerm)
  );

  const availableSeats = useMemo(() => {
    if (!newStudent.shiftId) return [];
    // A seat is available in a shift if no student in THAT shift is using it
    const shiftOccupiedSeatNumbers = students
      .filter(s => s.shiftId === newStudent.shiftId && s.seatNumber)
      .map(s => s.seatNumber);
    
    return seats.filter(s => !shiftOccupiedSeatNumbers.includes(s.number));
  }, [seats, students, newStudent.shiftId]);

  const currentShift = useMemo(() => shifts.find(s => s.id === newStudent.shiftId), [shifts, newStudent.shiftId]);
  
  const calculateFee = () => {
    if (!currentShift) return 0;
    return currentShift.monthlyFee * (newStudent.planDurationMonths || 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.mobile || !newStudent.shiftId) return;
    
    const expiry = new Date(newStudent.joiningDate!);
    expiry.setMonth(expiry.getMonth() + (newStudent.planDurationMonths || 1));

    addStudent({
      fullName: newStudent.fullName!,
      fatherName: newStudent.fatherName || 'Not Provided',
      mobile: newStudent.mobile!,
      address: newStudent.address || 'Local',
      seatNumber: newStudent.seatNumber || null,
      shiftId: newStudent.shiftId!,
      idProofType: newStudent.idProofType || 'Aadhar',
      idProofNumber: newStudent.idProofNumber || 'N/A',
      photoUrl: `https://picsum.photos/seed/${newStudent.fullName}/150/150`,
      joiningDate: newStudent.joiningDate!,
      planFee: calculateFee(),
      planDurationMonths: newStudent.planDurationMonths!,
      expiryDate: expiry.toISOString().split('T')[0],
    });
    setIsModalOpen(false);
    setNewStudent({ planDurationMonths: 1, joiningDate: new Date().toISOString().split('T')[0], shiftId: shifts[0]?.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold"
        >
          <Plus size={20} /> Register Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4">Seating</th>
              <th className="px-6 py-4">Plan Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => {
              const shift = shifts.find(s => s.id === student.shiftId);
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={student.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                      <div>
                        <p className="font-bold text-gray-800">{student.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-indigo-400" />
                      {shift?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <MapPin size={14} />
                      <span className="font-bold">{student.seatNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-700">₹{student.planFee}</p>
                    <p className="text-[10px] text-gray-400">Till {new Date(student.expiryDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onViewProfile(student.id)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg"><Eye size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-900 text-white">
              <h3 className="text-xl font-black">Admission Form</h3>
              <button onClick={() => setIsModalOpen(false)}><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Shift *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shifts.filter(s => s.isActive).map(shift => (
                    <button
                      key={shift.id}
                      type="button"
                      onClick={() => setNewStudent({...newStudent, shiftId: shift.id, seatNumber: ''})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        newStudent.shiftId === shift.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-black text-indigo-900">{shift.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{shift.startTime} - {shift.endTime}</p>
                      <p className="text-sm font-black text-gray-700 mt-2">₹{shift.monthlyFee}/mo</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Full Name *</label>
                <input required type="text" value={newStudent.fullName || ''} onChange={e => setNewStudent({...newStudent, fullName: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Mobile *</label>
                <input required type="tel" value={newStudent.mobile || ''} onChange={e => setNewStudent({...newStudent, mobile: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Available Seats in Shift</label>
                <select value={newStudent.seatNumber || ''} onChange={e => setNewStudent({...newStudent, seatNumber: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                  <option value="">Select Seat</option>
                  {availableSeats.map(s => <option key={s.id} value={s.number}>{s.number}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Plan Period</label>
                <select value={newStudent.planDurationMonths || 1} onChange={e => setNewStudent({...newStudent, planDurationMonths: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                  {PLANS.map(p => <option key={p.label} value={p.duration}>{p.label}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 p-6 bg-indigo-50 rounded-2xl flex justify-between items-center">
                 <div>
                    <p className="text-xs font-black text-indigo-400 uppercase">Calculated Admission Fee</p>
                    <p className="text-2xl font-black text-indigo-900">₹{calculateFee()}</p>
                 </div>
                 <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg">
                    Confirm Admission
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
