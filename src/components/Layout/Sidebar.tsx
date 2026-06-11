import {
  LayoutDashboard,
  CalendarCheck,
  Ship,
  MessageSquare,
  ClipboardList,
  MessageCircle,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '态势总览' },
  { id: 'booking', icon: CalendarCheck, label: '入口预约' },
  { id: 'cruise', icon: Ship, label: '游船码头' },
  { id: 'guide', icon: MessageSquare, label: '讲解服务' },
  { id: 'cleaning', icon: ClipboardList, label: '保洁工单' },
  { id: 'feedback', icon: MessageCircle, label: '游客反馈' },
  { id: 'reports', icon: BarChart3, label: '报表中心' },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <span className="text-xl font-bold">西</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold">西湖景区</h1>
              <p className="text-xs text-slate-400">调度平台</p>
            </div>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
      >
        {isCollapsed ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
    </aside>
  );
}