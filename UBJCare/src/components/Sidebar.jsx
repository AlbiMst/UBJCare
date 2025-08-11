import React from 'react';
import { Users, MessageSquare, TrendingUp, Settings, User, Plus, BarChart3, X } from 'lucide-react';

function Sidebar({ activeTab, onTabChange, isAdmin, userName, userPhoto, onProfileClick, isSidebarOpen, setIsSidebarOpen }) {
  const adminMenuItems = [
    { id: 'complaints', label: 'Pengaduan', icon: MessageSquare },
    { id: 'users', label: 'Pengguna', icon: Users },
    // { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const userMenuItems = [
    { id: 'complaints', label: 'Pengaduan Saya', icon: MessageSquare },
    { id: 'new-complaint', label: 'Pengaduan Baru', icon: Plus },
    // { id: 'profile', label: 'Profil', icon: User },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
          {isAdmin ? 'Dashboard Admin' : 'Dashboard User'}
        </h1>
        {/* Close button for mobile */}
        <button
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onTabChange(item.id);
                    if (setIsSidebarOpen) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700 border-l-2 border-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => {
            if (onProfileClick) {
              onProfileClick();
            }
            if (setIsSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
          className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Profil"
              className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Pengguna'}</p>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 h-screen flex-col fixed lg:sticky top-0 z-20">
        {sidebarContent}
      </div>
    </>
  );
}

export default Sidebar;