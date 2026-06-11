import { Bell, User, Settings, LogOut } from 'lucide-react';
import { currentUser } from '../../data/mockData';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-slate-800">
          {currentUser.department}
        </span>
        <span className="text-sm text-slate-500">|</span>
        <span className="text-sm text-slate-600">
          欢迎, {currentUser.username}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
            <span className="text-sm font-medium">{currentUser.username}</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}