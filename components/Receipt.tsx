
import React from 'react';
import { Payment, Student } from '../types';
import { LIBRARY_NAME, LIBRARY_TAGLINE } from '../constants';
import { Printer, X } from 'lucide-react';

interface ReceiptProps {
  payment: Payment;
  student: Student;
  dueAmount: number;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ payment, student, dueAmount, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:m-0 print:w-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center print:hidden">
          <h3 className="font-bold text-gray-800">Payment Receipt</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
              <Printer size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div id="printable-receipt" className="p-8 space-y-6">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #printable-receipt, #printable-receipt * { visibility: visible; }
              #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
            }
          `}</style>
          
          <div className="text-center">
            <h1 className="text-2xl font-black text-indigo-900 tracking-tighter">{LIBRARY_NAME}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">{LIBRARY_TAGLINE}</p>
            <div className="mt-4 border-y border-dashed border-gray-200 py-2">
               <p className="text-[10px] text-gray-400 font-bold uppercase">Transaction Details</p>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">Receipt No:</p>
              <p className="font-bold text-gray-800">{payment.receiptNumber}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-gray-500">Date:</p>
              <p className="font-bold text-gray-800">{new Date(payment.date).toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Student Name</span>
              <span className="text-sm font-bold text-gray-800">{student.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Student ID</span>
              <span className="text-sm font-bold text-gray-800">{student.studentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Seat Number</span>
              <span className="text-sm font-bold text-gray-800">{student.seatNumber || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-gray-600">Paid Amount</span>
              <span className="font-black text-indigo-600">₹{payment.amount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Mode</span>
              <span className="font-bold text-gray-700">{payment.mode}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
              <span className="text-gray-500 font-bold italic">Balance Due</span>
              <span className="font-bold text-red-500">₹{dueAmount}</span>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-dashed border-gray-200">
            <p className="text-[10px] text-gray-400 font-medium italic">This is a computer generated receipt. No signature required.</p>
            <p className="text-xs font-bold text-gray-800 mt-2">Thank you for choosing {LIBRARY_NAME}!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
