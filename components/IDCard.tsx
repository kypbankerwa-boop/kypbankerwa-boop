
import React from 'react';
import { Student } from '../types';
import { LIBRARY_NAME, LIBRARY_TAGLINE } from '../constants';
import { Printer, X, Download } from 'lucide-react';

interface IDCardProps {
  student: Student;
  onClose: () => void;
}

const IDCard: React.FC<IDCardProps> = ({ student, onClose }) => {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-gray-100 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden print:bg-white">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center print:hidden">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">Student Identity Card</h3>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm">
              <Printer size={16} /> Print PVC Size
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 text-gray-400 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div id="id-card-print" className="p-8 flex flex-col md:flex-row gap-8 justify-center items-center overflow-auto">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #id-card-print, #id-card-print * { visibility: visible; }
              #id-card-print { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                display: flex; 
                flex-direction: column;
                align-items: center;
                gap: 40px;
                padding: 40px;
              }
              .id-card-side { break-inside: avoid; border: 1px solid #ddd; }
            }
          `}</style>

          {/* Front Side */}
          <div className="id-card-side w-[320px] h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200 relative">
            <div className="bg-indigo-900 p-6 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full"></div>
               <h1 className="text-xl font-black tracking-tighter z-10 relative">{LIBRARY_NAME}</h1>
               <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1 z-10 relative">Digital Student ID</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center p-6 space-y-4">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-50 overflow-hidden shadow-inner bg-gray-100">
                <img src={student.photoUrl || 'https://picsum.photos/150/150'} className="w-full h-full object-cover" alt={student.fullName} />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-indigo-900 uppercase">{student.fullName}</h2>
                <p className="text-sm font-bold text-gray-500 italic">Father: {student.fatherName}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Seat No</p>
                  <p className="text-lg font-black text-indigo-600">{student.seatNumber || 'Unassigned'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Student ID</p>
                  <p className="text-lg font-black text-indigo-600">{student.studentId}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 text-center">
               <p className="text-xs font-bold text-gray-600">{student.mobile}</p>
            </div>
          </div>

          {/* Back Side */}
          <div className="id-card-side w-[320px] h-[500px] bg-indigo-900 rounded-2xl shadow-xl overflow-hidden flex flex-col text-white relative border border-indigo-800">
             <div className="p-6 border-b border-indigo-800/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Permanent Address</h3>
                <p className="text-sm mt-2 font-medium leading-relaxed">{student.address}</p>
             </div>

             <div className="p-6 space-y-4">
                <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-2">Valid Period</h3>
                   <div className="flex justify-between items-center text-sm font-bold">
                      <div className="text-center">
                         <p className="text-[10px] opacity-50">FROM</p>
                         <p>{new Date(student.joiningDate).toLocaleDateString()}</p>
                      </div>
                      <div className="w-8 h-px bg-white/20"></div>
                      <div className="text-center">
                         <p className="text-[10px] opacity-50">TO</p>
                         <p>{new Date(student.expiryDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-2">Library Rules</h3>
                   <ul className="text-[10px] space-y-1 list-disc list-inside opacity-80">
                      <li>Maintain silence at all times.</li>
                      <li>ID card is mandatory for entry.</li>
                      <li>No outside food/drinks allowed.</li>
                      <li>Management not responsible for loss.</li>
                   </ul>
                </div>
             </div>

             <div className="mt-auto p-6 bg-white flex items-center justify-between">
                <div className="text-indigo-900">
                   <p className="text-[8px] font-black uppercase mb-1">Authenticated QR</p>
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${student.studentId}`} alt="QR Code" className="w-12 h-12" />
                </div>
                <div className="text-right">
                   <p className="text-[8px] text-gray-400 font-bold uppercase mb-4">Official Seal</p>
                   <div className="w-16 h-8 border border-indigo-100 rounded opacity-30"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
