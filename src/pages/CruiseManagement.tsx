import { useState } from 'react';
import { Ship, Clock, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { cruises, cruiseSchedules } from '../data/mockData';

export default function CruiseManagement() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [showModal, setShowModal] = useState(false);

  const fleetTableData = cruises.map(cruise => ({
    id: cruise.id,
    name: cruise.name,
    capacity: cruise.capacity,
    status: <Badge status={cruise.status} type="cruise" />,
  }));

  const fleetColumns = [
    { key: 'name', label: '游船名称', align: 'left' as const },
    { key: 'capacity', label: '载客量', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const scheduleTableData = cruiseSchedules.map(schedule => ({
    id: schedule.id,
    cruiseName: schedule.cruiseName,
    departureTime: schedule.departureTime,
    status: <Badge 
      status={schedule.status === 'departed' ? 'verified' : schedule.status === 'scheduled' ? 'pending' : 'cancelled'} 
      type="booking" 
    />,
  }));

  const scheduleColumns = [
    { key: 'cruiseName', label: '游船名称', align: 'left' as const },
    { key: 'departureTime', label: '发船时间', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const rowActions = () => (
    <>
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="调整班次">
        <RefreshCw className="w-4 h-4" />
      </button>
      <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="取消班次">
        <AlertCircle className="w-4 h-4" />
      </button>
    </>
  );

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
          <Clock className="w-4 h-4" />
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
        <Table columns={scheduleColumns} data={scheduleTableData} rowActions={rowActions} />
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
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {cruises.filter(c => c.status !== 'maintenance').map(cruise => (
                <option key={cruise.id}>{cruise.name} (载客量: {cruise.capacity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发船时间</label>
            <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              确认添加
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}