import { useState } from 'react';
import { Search, Plus, CheckCircle, XCircle, Filter, Ship, MessageSquare, Clock, Users } from 'lucide-react';
import { Table, Badge, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings');
  const [formData, setFormData] = useState({
    userName: '',
    entryPoint: '断桥入口',
    visitDate: '',
    timeSlot: '08:00-09:00',
    hasGuideService: false,
    hasCruiseService: false,
    passengerCount: 1,
  });

  const { bookings, guides, guideSchedules, cruises, cruiseSchedules, verifyBooking, cancelBooking, addBooking, assignGuideToBooking, getPendingDispatchList } = useStore();
  const pendingDispatchList = getPendingDispatchList();

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.entryPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.timeSlot.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredBookings.map(booking => {
    const hasServices = booking.hasGuideService || booking.hasCruiseService;
    return {
      id: booking.id,
      entryPoint: (
        <div className="flex items-center gap-2">
          <span>{booking.entryPoint}</span>
          {hasServices && (
            <div className="flex items-center gap-1">
              {booking.hasGuideService && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                  <MessageSquare className="w-3 h-3 mr-0.5" />
                  讲解
                </span>
              )}
              {booking.hasCruiseService && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  <Ship className="w-3 h-3 mr-0.5" />
                  游船
                </span>
              )}
            </div>
          )}
        </div>
      ),
      visitDate: booking.visitDate,
      timeSlot: booking.timeSlot,
      status: <Badge status={booking.status} type="booking" />,
      createdAt: booking.createdAt,
    };
  });

  const columns = [
    { key: 'entryPoint', label: '入口', align: 'left' as const },
    { key: 'visitDate', label: '预约日期', align: 'center' as const },
    { key: 'timeSlot', label: '时段', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'createdAt', label: '预约时间', align: 'left' as const },
  ];

  const dispatchTableData = pendingDispatchList.map(booking => ({
    id: booking.id,
    entryPoint: booking.entryPoint,
    visitDate: booking.visitDate,
    timeSlot: booking.timeSlot,
    services: (
      <div className="flex items-center gap-2">
        {booking.hasGuideService && (
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            需要讲解
          </span>
        )}
        {booking.hasCruiseService && (
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            <Ship className="w-3 h-3 mr-1" />
            需要游船
          </span>
        )}
      </div>
    ),
    passengerCount: booking.hasCruiseService ? `${booking.passengerCount || 1}人` : '-',
  }));

  const dispatchColumns = [
    { key: 'entryPoint', label: '入口', align: 'left' as const },
    { key: 'visitDate', label: '预约日期', align: 'center' as const },
    { key: 'timeSlot', label: '时段', align: 'center' as const },
    { key: 'services', label: '附加服务', align: 'left' as const },
    { key: 'passengerCount', label: '人数', align: 'center' as const },
  ];

  const rowActions = (row: Record<string, any>) => {
    const booking = bookings.find(b => b.id === row.id);
    if (!booking) return null;
    
    return (
      <>
        {booking.status === 'pending' && (
          <button 
            onClick={() => verifyBooking(booking.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
            title="核销"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        {booking.status !== 'cancelled' && (
          <button 
            onClick={() => cancelBooking(booking.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
            title="取消"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  const dispatchActions = (row: Record<string, any>) => {
    const booking = pendingDispatchList.find(b => b.id === row.id);
    if (!booking) return null;
    
    return (
      <>
        {booking.hasGuideService && (
          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="分派讲解员">
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
        {booking.hasCruiseService && (
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="分派游船">
            <Ship className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  const handleSubmit = () => {
    addBooking({
      userId: 'new_user',
      entryPoint: formData.entryPoint,
      visitDate: formData.visitDate || '2024-01-15',
      timeSlot: formData.timeSlot,
      status: 'pending',
      hasGuideService: formData.hasGuideService,
      hasCruiseService: formData.hasCruiseService,
      passengerCount: formData.passengerCount,
    });
    setFormData({ 
      userName: '', 
      entryPoint: '断桥入口', 
      visitDate: '', 
      timeSlot: '08:00-09:00',
      hasGuideService: false,
      hasCruiseService: false,
      passengerCount: 1,
    });
    setShowModal(false);
  };

  const availableGuides = guides.filter(g => g.status === 'available').length;
  const availableCruises = cruises.filter(c => c.status === 'available').length;

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

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>预约列表</span>
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'dispatch' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>待调度</span>
          {pendingDispatchList.length > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
              {pendingDispatchList.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'bookings' && (
        <>
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
        </>
      )}

      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-2">资源可用情况</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-slate-600">空闲讲解员: </span>
                <span className="font-semibold text-purple-600">{availableGuides}人</span>
              </div>
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600">可用游船: </span>
                <span className="font-semibold text-blue-600">{availableCruises}艘</span>
              </div>
            </div>
          </div>
          
          {pendingDispatchList.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">暂无待调度预约</p>
              <p className="text-sm text-slate-400 mt-1">所有附加服务需求已处理完毕</p>
            </div>
          ) : (
            <Table columns={dispatchColumns} data={dispatchTableData} rowActions={dispatchActions} />
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增预约">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">游客姓名</label>
            <input 
              type="text" 
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="请输入游客姓名" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">选择入口</label>
            <select 
              value={formData.entryPoint}
              onChange={(e) => setFormData({...formData, entryPoint: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>断桥入口</option>
              <option>苏堤入口</option>
              <option>白堤入口</option>
              <option>曲院风荷</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">预约日期</label>
              <input 
                type="date" 
                value={formData.visitDate}
                onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">时段</label>
              <select 
                value={formData.timeSlot}
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
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
          
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">附加服务（可选）</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                <input 
                  type="checkbox"
                  checked={formData.hasGuideService}
                  onChange={(e) => setFormData({...formData, hasGuideService: e.target.checked})}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <span className="font-medium text-slate-700">需要讲解服务</span>
                  <p className="text-xs text-slate-500">安排专业讲解员全程陪同</p>
                </div>
                <span className="text-xs text-purple-600">{availableGuides}人可用</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                <input 
                  type="checkbox"
                  checked={formData.hasCruiseService}
                  onChange={(e) => setFormData({...formData, hasCruiseService: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <Ship className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <span className="font-medium text-slate-700">需要游船服务</span>
                  <p className="text-xs text-slate-500">乘坐游船游览西湖风光</p>
                </div>
                <span className="text-xs text-blue-600">{availableCruises}艘可用</span>
              </label>
              
              {formData.hasCruiseService && (
                <div className="pl-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">乘坐人数</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={formData.passengerCount}
                    onChange={(e) => setFormData({...formData, passengerCount: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              确认预约
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}