import { useState } from 'react';
import { Search, Plus, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Table, Badge, Modal } from '../components/Common';
import { bookings } from '../data/mockData';

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.entryPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.timeSlot.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredBookings.map(booking => ({
    id: booking.id,
    entryPoint: booking.entryPoint,
    visitDate: booking.visitDate,
    timeSlot: booking.timeSlot,
    status: <Badge status={booking.status} type="booking" />,
    createdAt: booking.createdAt,
  }));

  const columns = [
    { key: 'entryPoint', label: '入口', align: 'left' as const },
    { key: 'visitDate', label: '预约日期', align: 'center' as const },
    { key: 'timeSlot', label: '时段', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'createdAt', label: '预约时间', align: 'left' as const },
  ];

  const rowActions = (row: Record<string, any>) => {
    const booking = bookings.find(b => b.id === row.id);
    if (!booking) return null;
    
    return (
      <>
        {booking.status === 'pending' && (
          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="核销">
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        {booking.status !== 'cancelled' && (
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="取消">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">入口预约</h1>
          <p className="text-slate-500 mt-1">管理景区入口分时预约与核销</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新增预约</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索入口或时段..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">全部状态</option>
            <option value="pending">待核销</option>
            <option value="verified">已核销</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={tableData} rowActions={rowActions} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增预约">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">游客姓名</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入游客姓名" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">选择入口</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>断桥入口</option>
              <option>苏堤入口</option>
              <option>白堤入口</option>
              <option>曲院风荷</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">预约日期</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">时段</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>08:00-09:00</option>
                <option>09:00-10:00</option>
                <option>10:00-11:00</option>
                <option>11:00-12:00</option>
                <option>13:00-14:00</option>
                <option>14:00-15:00</option>
                <option>15:00-16:00</option>
                <option>16:00-17:00</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              确认预约
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}