import { useState } from 'react';
import { Search, Plus, CheckCircle, XCircle, Filter, Ship, MessageSquare, Clock, Users, Ticket, Check } from 'lucide-react';
import { Table, Badge, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings');
  const [dispatchModal, setDispatchModal] = useState(false);
  const [dispatchType, setDispatchType] = useState<'guide' | 'cruise' | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    userName: '',
    entryPoint: '断桥入口',
    visitDate: '',
    timeSlot: '08:00-09:00',
    hasGuideService: false,
    hasCruiseService: false,
    passengerCount: 1,
    selectedGuideId: '',
    selectedGuideName: '',
    selectedScheduleId: '',
    selectedCruiseName: '',
  });

  const { 
    bookings, guides, guideSchedules, cruises, cruiseSchedules, cruiseReservations,
    verifyBooking, cancelBooking, addBooking, 
    dispatchBookingGuide, dispatchBookingCruise, getCruiseAvailableSeats, getPendingDispatchList 
  } = useStore();
  
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
                  {booking.guideName || '讲解'}
                </span>
              )}
              {booking.hasCruiseService && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  <Ship className="w-3 h-3 mr-0.5" />
                  {booking.cruiseName || '游船'}{booking.passengerCount ? `${booking.passengerCount}人` : ''}
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
    { key: 'entryPoint', label: '入口/附加服务', align: 'left' as const },
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
        {booking.hasGuideService && !booking.guideScheduleId && (
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            需要讲解
          </span>
        )}
        {booking.hasCruiseService && !booking.cruiseScheduleId && (
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            <Ship className="w-3 h-3 mr-1" />
            需要游船
          </span>
        )}
        {booking.hasGuideService && booking.guideScheduleId && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <Check className="w-3 h-3 mr-1" />
            讲解已分派
          </span>
        )}
        {booking.hasCruiseService && booking.cruiseScheduleId && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <Check className="w-3 h-3 mr-1" />
            游船已分派
          </span>
        )}
      </div>
    ),
    passengerCount: booking.hasCruiseService ? `${booking.passengerCount || 1}人` : '-',
    action: '待分派',
  }));

  const dispatchColumns = [
    { key: 'entryPoint', label: '入口', align: 'left' as const },
    { key: 'visitDate', label: '日期', align: 'center' as const },
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
      <div className="flex items-center gap-2">
        {booking.hasGuideService && !booking.guideScheduleId && (
          <button 
            onClick={() => {
              setSelectedBooking(booking);
              setDispatchType('guide');
              setFormData({...formData, selectedGuideId: '', selectedGuideName: ''});
              setDispatchModal(true);
            }}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
            title="分派讲解员"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
        {booking.hasCruiseService && !booking.cruiseScheduleId && (
          <button 
            onClick={() => {
              setSelectedBooking(booking);
              setDispatchType('cruise');
              setFormData({...formData, selectedScheduleId: '', selectedCruiseName: ''});
              setDispatchModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            title="分派游船"
          >
            <Ship className="w-4 h-4" />
          </button>
        )}
      </div>
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
      selectedGuideId: '',
      selectedGuideName: '',
      selectedScheduleId: '',
      selectedCruiseName: '',
    });
    setShowModal(false);
  };

  const handleDispatch = () => {
    if (!selectedBooking) return;
    
    if (dispatchType === 'guide' && formData.selectedGuideId) {
      dispatchBookingGuide(selectedBooking.id, formData.selectedGuideId, formData.selectedGuideName);
    } else if (dispatchType === 'cruise' && formData.selectedScheduleId) {
      dispatchBookingCruise(selectedBooking.id, formData.selectedScheduleId, formData.selectedCruiseName, selectedBooking.passengerCount || 1);
    }
    
    setDispatchModal(false);
    setSelectedBooking(null);
    setDispatchType(null);
  };

  const availableGuides = guides.filter(g => g.status === 'available');
  const availableSchedules = cruiseSchedules.filter(s => {
    if (s.status !== 'scheduled') return false;
    const seats = getCruiseAvailableSeats(s.id);
    return seats.available > 0;
  });

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
          <span className="text-xs opacity-75">({filteredBookings.length})</span>
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
            <h3 className="font-semibold text-slate-800 mb-2">待调度资源需求</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-slate-600">空闲讲解员: </span>
                <span className="font-semibold text-purple-600">{availableGuides.length}人</span>
              </div>
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600">可用班次: </span>
                <span className="font-semibold text-blue-600">{availableSchedules.length}班</span>
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
                <span className="text-xs text-purple-600">{availableGuides.length}人可用</span>
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
                <span className="text-xs text-blue-600">{availableSchedules.length}班可用</span>
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

      <Modal 
        isOpen={dispatchModal} 
        onClose={() => { setDispatchModal(false); setSelectedBooking(null); setDispatchType(null); }} 
        title={dispatchType === 'guide' ? '分派讲解员' : '分派游船'}
      >
        <div className="space-y-4">
          {selectedBooking && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-600">
                预约: <span className="font-medium">{selectedBooking.entryPoint}</span> | 
                {selectedBooking.visitDate} {selectedBooking.timeSlot}
              </p>
            </div>
          )}

          {dispatchType === 'guide' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">选择可用讲解员</label>
              <div className="space-y-2">
                {availableGuides.length === 0 ? (
                  <p className="text-slate-500 text-sm">暂无空闲讲解员</p>
                ) : (
                  availableGuides.map(guide => (
                    <label 
                      key={guide.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        formData.selectedGuideId === guide.id ? 'bg-purple-100 border-2 border-purple-500' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <input 
                        type="radio"
                        name="guide"
                        checked={formData.selectedGuideId === guide.id}
                        onChange={() => setFormData({...formData, selectedGuideId: guide.id, selectedGuideName: guide.name})}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-slate-700">{guide.name}</span>
                        <p className="text-xs text-slate-500">{guide.phone}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {dispatchType === 'cruise' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">选择可用班次</label>
              <div className="space-y-2">
                {availableSchedules.length === 0 ? (
                  <p className="text-slate-500 text-sm">暂无可用班次</p>
                ) : (
                  availableSchedules.map(schedule => {
                    const seats = getCruiseAvailableSeats(schedule.id);
                    return (
                      <label 
                        key={schedule.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          formData.selectedScheduleId === schedule.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <input 
                          type="radio"
                          name="schedule"
                          checked={formData.selectedScheduleId === schedule.id}
                          onChange={() => setFormData({...formData, selectedScheduleId: schedule.id, selectedCruiseName: schedule.cruiseName})}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-slate-700">{schedule.cruiseName}</span>
                          <span className="mx-2 text-slate-400">|</span>
                          <span className="text-slate-600">{schedule.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Ticket className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-500">剩余{seats.available}座</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => { setDispatchModal(false); setSelectedBooking(null); setDispatchType(null); }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleDispatch}
              disabled={(dispatchType === 'guide' && !formData.selectedGuideId) || (dispatchType === 'cruise' && !formData.selectedScheduleId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认分派
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}