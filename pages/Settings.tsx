
import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Clock, Plus, Edit2, Trash2, CheckCircle2, XCircle, DollarSign, Save, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Shift } from '../types';

const Settings: React.FC = () => {
  const { shifts, addShift, updateShift, deleteShift, currentUser } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Partial<Shift> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <XCircle size={64} className="text-rose-500 mb-4 opacity-20" />
        <h2 className="text-2xl font-black text-gray-800">Access Restricted</h2>
        <p className="text-gray-500">Only administrators can access library settings.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    
    if (editingShift.id) {
      updateShift(editingShift.id, editingShift);
      setFeedback({ type: 'success', message: 'Shift updated successfully.' });
    } else {
      addShift({
        name: editingShift.name || 'New Shift',
        startTime: editingShift.startTime || '09:00',
        endTime: editingShift.endTime || '17:00',
        monthlyFee: editingShift.monthlyFee || 0,
        isActive: editingShift.isActive ?? true
      });
      setFeedback({ type: 'success', message: 'New shift created.' });
    }
    setIsModalOpen(false);
    setEditingShift(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteShift = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the shift "${name}"? This action cannot be undone.`)) {
      const result = deleteShift(id);
      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Shift Master</h2>
          <p className="text-sm font-medium text-gray-500">Define library timings and pricing rules</p>
        </div>
        <button 
          onClick={() => {
            setEditingShift({ name: '', startTime: '06:00', endTime: '12:00', monthlyFee: 800, isActive: true });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> Add New Shift
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top duration-300 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
          <p className="text-sm font-bold">{feedback.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shifts.map(shift => (
          <div key={shift.id} className={`bg-white p-6 rounded-3xl border transition-all duration-300 ${shift.isActive ? 'border-gray-100 shadow-sm' : 'border-gray-200 bg-gray-50/50 opacity-75 grayscale-[0.5]'} relative overflow-hidden group hover:shadow-md`}>
            {!shift.isActive && (
               <div className="absolute top-0 right-0 bg-gray-300 text-gray-600 px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest">Deactivated</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${shift.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-400'}`}>
                <Clock size={24} />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    setEditingShift(shift);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Edit Shift"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteShift(shift.id, shift.name)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete Shift"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <h3 className={`text-xl font-black mb-1 transition-colors ${shift.isActive ? 'text-gray-800' : 'text-gray-500'}`}>{shift.name}</h3>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-6">
              <span>{shift.startTime}</span>
              <div className="w-4 h-px bg-gray-300"></div>
              <span>{shift.endTime}</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Monthly Fee</p>
                <p className={`text-2xl font-black transition-colors ${shift.isActive ? 'text-indigo-600' : 'text-gray-400'}`}>₹{shift.monthlyFee}</p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Status Toggle</p>
                <button 
                  onClick={() => updateShift(shift.id, { isActive: !shift.isActive })}
                  className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${shift.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}
                >
                  {shift.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-indigo-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">{editingShift?.id ? 'Update Shift' : 'New Shift'}</h3>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Configuration Panel</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingShift(null); }} className="hover:rotate-90 transition-transform"><XCircle size={28} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Shift Name</label>
                <input required type="text" placeholder="e.g. Afternoon Special" value={editingShift?.name || ''} onChange={e => setEditingShift({...editingShift!, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400">Start Time</label>
                  <input required type="time" value={editingShift?.startTime || ''} onChange={e => setEditingShift({...editingShift!, startTime: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400">End Time</label>
                  <input required type="time" value={editingShift?.endTime || ''} onChange={e => setEditingShift({...editingShift!, endTime: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">Monthly Fee (₹)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
                  <input required type="number" value={editingShift?.monthlyFee || 0} onChange={e => setEditingShift({...editingShift!, monthlyFee: parseInt(e.target.value)})} className="w-full pl-8 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                   <p className="text-xs font-black text-gray-800 uppercase">Active Status</p>
                   <p className="text-[10px] text-gray-400 font-bold">New admissions allowed?</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditingShift({...editingShift!, isActive: !editingShift?.isActive})}
                  className={`flex items-center gap-2 transition-all ${editingShift?.isActive ? 'text-indigo-600' : 'text-gray-300'}`}
                >
                  {editingShift?.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                <Save size={20} /> {editingShift?.id ? 'Update Configuration' : 'Create New Shift'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
