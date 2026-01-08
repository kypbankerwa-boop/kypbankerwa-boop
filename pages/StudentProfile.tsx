
import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { IndianRupee, MapPin, Calendar, Smartphone, FileText, ChevronLeft, Plus, Trash2, Printer, CreditCard, Clock } from 'lucide-react';
import Receipt from '../components/Receipt';
import IDCard from '../components/IDCard';

interface StudentProfileProps {
  id: string;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ id, onBack }) => {
  const { students, payments, addPayment, deletePayment, getStudentDue, shifts } = useLibrary();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{payment: any, student: any} | null>(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'ONLINE' | 'UPI'>('UPI');

  const student = students.find(s => s.id === id);
  if (!student) return <div>Student not found</div>;

  const studentPayments = payments.filter(p => p.studentId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const dueAmount = getStudentDue(id);
  const shift = shifts.find(s => s.id === student.shiftId);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newPaymentAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    addPayment({
      studentId: student.id,
      amount,
      date: new Date().toISOString().split('T')[0],
      mode: paymentMode,
    });
    setShowPaymentModal(false);
    setNewPaymentAmount('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-bold text-sm">
        <ChevronLeft size={18} /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-3xl bg-indigo-50 overflow-hidden mb-4 border-4 border-indigo-50 shadow-inner">
              <img src={student.photoUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{student.fullName}</h2>
            <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full mt-2 uppercase tracking-widest">{student.studentId}</p>
            
            <div className="w-full mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-[10px] text-gray-400 font-black uppercase">Shift</p>
                  <p className="text-xs font-black text-gray-800 truncate">{shift?.name || 'N/A'}</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-[10px] text-gray-400 font-black uppercase">Seat</p>
                  <p className="text-xl font-black text-indigo-600">{student.seatNumber || 'N/A'}</p>
               </div>
            </div>

            <div className="w-full mt-6 space-y-4">
              <button onClick={() => setShowIDCard(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 font-black py-4 rounded-2xl hover:bg-indigo-200 transition-all uppercase tracking-widest text-xs">
                 Generate ID Card
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Detailed Info</h3>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Timings</p>
                    <p className="text-sm font-bold text-gray-700">{shift?.startTime} - {shift?.endTime}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Contact</p>
                    <p className="text-sm font-bold text-gray-700">{student.mobile}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Membership</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(student.joiningDate).toLocaleDateString()} to {new Date(student.expiryDate).toLocaleDateString()}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-800">Fee Summary</h3>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold"
              >
                <Plus size={18} /> New Payment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="p-6 bg-indigo-50 rounded-3xl">
                  <p className="text-xs font-black uppercase text-indigo-400 mb-1">Total Plan Fee</p>
                  <p className="text-2xl font-black text-indigo-900">₹{student.planFee}</p>
               </div>
               <div className="p-6 bg-emerald-50 rounded-3xl">
                  <p className="text-xs font-black uppercase text-emerald-400 mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-emerald-900">₹{student.planFee - dueAmount}</p>
               </div>
               <div className="p-6 bg-rose-50 rounded-3xl">
                  <p className="text-xs font-black uppercase text-rose-400 mb-1">Outstanding Due</p>
                  <p className="text-2xl font-black text-rose-900">₹{dueAmount}</p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Payment History</h4>
              <div className="divide-y divide-gray-100">
                {studentPayments.map(p => (
                  <div key={p.id} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                          <IndianRupee size={20} />
                       </div>
                       <div>
                          <p className="font-black text-gray-800">₹{p.amount}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{p.mode} • {p.receiptNumber}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-gray-500 mr-4">{new Date(p.date).toLocaleDateString()}</p>
                       <button onClick={() => setSelectedReceipt({ payment: p, student })} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg"><Printer size={18} /></button>
                       <button onClick={() => { if(confirm('Delete this payment?')) deletePayment(p.id) }} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)}><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleAddPayment} className="p-8 space-y-6">
              <div>
                <label className="text-xs font-black uppercase text-gray-400">Amount (₹)</label>
                <input required type="number" value={newPaymentAmount} onChange={e => setNewPaymentAmount(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl text-2xl font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-400">Payment Mode</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['UPI', 'CASH', 'ONLINE'].map(mode => (
                    <button key={mode} type="button" onClick={() => setPaymentMode(mode as any)} className={`p-3 rounded-xl border-2 font-bold text-xs ${paymentMode === mode ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-gray-100 text-gray-400'}`}>{mode}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Confirm Payment</button>
            </form>
          </div>
        </div>
      )}

      {selectedReceipt && <Receipt payment={selectedReceipt.payment} student={selectedReceipt.student} dueAmount={getStudentDue(selectedReceipt.student.id)} onClose={() => setSelectedReceipt(null)} />}
      {showIDCard && <IDCard student={student} onClose={() => setShowIDCard(false)} />}
    </div>
  );
};

export default StudentProfile;
