import { useState } from 'react';
import { Ship, Clock, Navigation, Edit2, AlertCircle, Users, Ticket, ArrowRightLeft } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function CruiseManagement() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({
    cruiseId: '',
    cruiseName: '',
    departureTime: '',
    passengerCount: 0,
  });

  const { 
    cruises, cruiseSchedules, cruiseReservations, 
    addCruiseSchedule, updateCruiseSchedule, cancelCruiseSchedule,
    addCruiseReservation, getCruiseAvailableSeats 
  } = useStore();

  const fleetTableData = cruises.map(cruise => {
    const totalSeats = cruise.capacity;
    const reservedSeats = cruiseReservations
      .filter(r => {
        const schedule = cruiseSchedules.find(s => s.cruiseId === cruise.id && r.scheduleId === s.id);
        return schedule && r.status === 'confirmed';
      })
      .reduce((sum, r) => sum + r.passengerCount, 0);
    const occupancyRate = totalSeats > 0 ? (reservedSeats / totalSeats * 100).toFixed(0) : '0';
    
    return {
      id: cruise.id,
      name: cruise.name,
      capacity: (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{cruise.capacity}</span>
        </div>
      ),
      occupancy: (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-20">
            <div 
              className={`h-full transition-all ${parseInt(occupancyRate) > 80 ? 'bg-red-500' : parseInt(occupancyRate) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <span className="text-sm text-slate-600">{reservedSeats}/{totalSeats}</span>
        </div>
      ),
      status: <Badge status={cruise.status} type="cruise" />,
    };
  });

  const fleetColumns = [
    { key: 'name', label: '游船名称', align: 'left' as const },
    { key: 'capacity', label: '载客量', align: 'center' as const },
    { key: 'occupancy', label: '占用情况', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const scheduleTableData = cruiseSchedules.map(schedule => {
    const cruise = cruises.find(c => c.id === schedule.cruiseId);
    const seats = getCruiseAvailableSeats(schedule.id);
    const pendingReschedule = cruiseReservations.filter(r => r.scheduleId === schedule.id && r.status === 'pending_reschedule').length;
    const occupancyRate = seats.total > 0 ? (seats.reserved / seats.total * 100).toFixed(0) : '0';
    
    return {
      id: schedule.id,
      cruiseName: schedule.cruiseName,
      departureTime: schedule.departureTime,
      capacity: (
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-slate-400" />
          <span>{seats.reserved}/{seats.total}</span>
          <span className="text-xs text-slate-400">剩余{seats.available}</span>
        </div>
      ),
      occupancy: (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-20">
            <div 
              className={`h-full transition-all ${parseInt(occupancyRate) > 80 ? 'bg-red-500' : parseInt(occupancyRate) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <span className={`text-xs ${parseInt(occupancyRate) > 80 ? 'text-red-600' : 'text-slate-500'}`}>
            {occupancyRate}%
          </span>
        </div>
      ),
      reschedule: pendingReschedule > 0 ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
          <ArrowRightLeft className="w-3 h-3" />
          {pendingReschedule}人待改签
        </span>
      ) : (
        <span className="text-xs text-slate-400">-</span>
      ),
      status: <Badge 
        status={schedule.status === 'departed' ? 'verified' : schedule.status === 'scheduled' ? 'pending' : 'cancelled'} 
        type="booking" 
      />,
    };
  });

  const scheduleColumns = [
    { key: 'cruiseName', label: '游船名称', align: 'left' as const },
    { key: 'departureTime', label: '发船时间', align: 'center' as const },
    { key: 'capacity', label: '座位', align: 'left' as const },
    { key: 'occupancy', label: '占用率', align: 'left' as const },
    { key: 'reschedule', label: '改签', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const scheduleActions = (row: Record<string, any>) => {
    const schedule = cruiseSchedules.find(s => s.id === row.id);
    if (!schedule) return null;
    
    return (
      <>
        {schedule.status === 'scheduled' && (
          <button 
            onClick={() => {
              setEditingId(schedule.id);
              setFormData({ cruiseId: schedule.cruiseId, cruiseName: schedule.cruiseName, departureTime: schedule.departureTime, passengerCount: 0 });
              setEditModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            title="调整班次"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {schedule.status !== 'cancelled' && (
          <button 
            onClick={() => cancelCruiseSchedule(schedule.id)}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
            title="取消班次"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  const handleAddSchedule = () => {
    const cruise = cruises.find(c => c.id === formData.cruiseId);
    if (!cruise) return;
    addCruiseSchedule({
      cruiseId: formData.cruiseId,
      cruiseName: cruise.name,
      departureTime: formData.departureTime,
      status: 'scheduled',
    });
    if (formData.passengerCount > 0) {
      const schedule = cruiseSchedules[cruiseSchedules.length];
      if (schedule) {
        addCruiseReservation({
          scheduleId: schedule.id,
          passengerCount: formData.passengerCount,
          status: 'confirmed',
        });
      }
    }
    setFormData({ cruiseId: '', cruiseName: '', departureTime: '', passengerCount: 0 });
    setShowModal(false);
  };

  const handleUpdateSchedule = () => {
    updateCruiseSchedule(editingId, formData.departureTime);
    if (formData.passengerCount > 0) {
      addCruiseReservation({
        scheduleId: editingId,
        passengerCount: formData.passengerCount,
        status: 'confirmed',
      });
    }
    setEditModal(false);
    setEditingId('');
    setFormData({ cruiseId: '', cruiseName: '', departureTime: '', passengerCount: 0 });
  };

  const availableCruises = cruises.filter(c => c.status !== 'maintenance');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">游船码头</h1>
          <p className="text-slate-500 mt-1">管理游船班次与实时监控</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span>新增班次</span>
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'fleet' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>船队状态</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>班次计划</span>
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'location' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>实时位置</span>
        </button>
      </div>

      {activeTab === 'fleet' && (
        <Table columns={fleetColumns} data={fleetTableData} />
      )}

      {activeTab === 'schedule' && (
        <Table columns={scheduleColumns} data={scheduleTableData} rowActions={scheduleActions} />
      )}

      {activeTab === 'location' && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">游船实时位置</h2>
          <div className="h-80 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-500">地图视图</p>
                <p className="text-sm text-slate-400">显示游船实时位置</p>
              </div>
            </div>
            {cruises.filter(c => c.status === 'sailing').map((cruise, index) => (
              <div
                key={cruise.id}
                className="absolute w-4 h-4 bg-blue-500 rounded-full animate-pulse"
                style={{
                  left: `${30 + index * 20}%`,
                  top: `${30 + (index % 2) * 25}%`,
                }}
                title={cruise.name}
              />
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增班次">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">选择游船</label>
            <select 
              value={formData.cruiseId}
              onChange={(e) => {
                const cruise = cruises.find(c => c.id === e.target.value);
                if (cruise) {
                  setFormData({...formData, cruiseId: e.target.value, cruiseName: cruise.name, passengerCount: 0});
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">请选择游船</option>
              {availableCruises.map(cruise => {
                const seats = getCruiseAvailableSeats(cruise.id);
                return (
                  <option key={cruise.id} value={cruise.id}>
                    {cruise.name} (载客量: {cruise.capacity}, 已预约: {seats.reserved})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发船时间</label>
            <input 
              type="time" 
              value={formData.departureTime}
              onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          {formData.cruiseId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">预约人数</label>
              <input 
                type="number" 
                min="0"
                max={getCruiseAvailableSeats(formData.cruiseId).available}
                value={formData.passengerCount}
                onChange={(e) => setFormData({...formData, passengerCount: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="输入预约人数"
              />
              <p className="text-xs text-slate-500 mt-1">
                当前游船剩余座位: {getCruiseAvailableSeats(formData.cruiseId).available}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleAddSchedule}
              disabled={!formData.cruiseId || !formData.departureTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认添加
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setEditingId(''); }} title="调整班次">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">游船</label>
            <input 
              type="text" 
              value={formData.cruiseName}
              disabled
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发船时间</label>
            <input 
              type="time" 
              value={formData.departureTime}
              onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">增加预约人数</label>
            <input 
              type="number" 
              min="0"
              value={formData.passengerCount}
              onChange={(e) => setFormData({...formData, passengerCount: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="输入增加的人数"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => { setEditModal(false); setEditingId(''); }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleUpdateSchedule}
              disabled={!formData.departureTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认调整
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}