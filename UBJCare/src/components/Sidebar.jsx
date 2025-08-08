import React from 'react';
import { Users, MessageSquare, TrendingUp, Settings, User, Plus, BarChart3 } from 'lucide-react';

function Sidebar({ activeTab, onTabChange, isAdmin, userName, userPhoto, onProfileClick }) {
  const adminMenuItems = [
    { id: 'complaints', label: 'Pengaduan', icon: MessageSquare },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const userMenuItems = [
    { id: 'complaints', label: 'Pengaduan Saya', icon: MessageSquare },
    { id: 'new-complaint', label: 'Pengaduan Baru', icon: Plus },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed lg:sticky top-0 z-20">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{isAdmin ? 'Dasboard Admin' : 'Dasboard User'}</h1>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Profil"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Pengguna'}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;