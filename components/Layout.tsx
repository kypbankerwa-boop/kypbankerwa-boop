
import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { NAV_ITEMS, LIBRARY_NAME } from '../constants';
import { UserRole } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout } = useLibrary();

  if (!currentUser) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">{LIBRARY_NAME}</h1>
          <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-semibold">Management Console</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => setActiveTab(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.path 
                  ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-indigo-950/50">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-tighter">{currentUser.role}</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-red-500/20 rounded-md text-indigo-300 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <button
            key={item.path}
            onClick={() => setActiveTab(item.path)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.path ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right mr-4">
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p className="text-xs text-gray-500">GoLib System Online</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
