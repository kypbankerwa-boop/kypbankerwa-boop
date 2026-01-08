
import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import SeatMap from './pages/SeatMap';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { UserRole } from './types';
import { ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, login } = useLibrary();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
             <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">GOLIB PRO</h1>
          <p className="text-gray-500 mb-8 font-medium">Study Library Management System</p>
          <div className="space-y-4">
            <button 
              onClick={() => login(UserRole.ADMIN)}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all uppercase tracking-widest"
            >
              Login as Admin
            </button>
            <button 
              onClick={() => login(UserRole.STAFF)}
              className="w-full bg-white border-2 border-indigo-100 text-indigo-600 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all uppercase tracking-widest"
            >
              Login as Staff
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleViewStudentProfile = (id: string) => {
    setSelectedStudentId(id);
    setActiveTab('student-profile');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'students':
        return <Students onViewProfile={handleViewStudentProfile} />;
      case 'student-profile':
        return selectedStudentId ? (
          <StudentProfile id={selectedStudentId} onBack={() => setActiveTab('students')} />
        ) : <Dashboard onNavigate={setActiveTab} />;
      case 'seat-map':
        return <SeatMap onViewStudent={handleViewStudentProfile} />;
      case 'attendance':
        return <Attendance />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => {
      setActiveTab(tab);
      setSelectedStudentId(null);
    }}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
};

export default App;
