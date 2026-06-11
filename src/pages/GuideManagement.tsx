import { useState } from 'react';
import { MessageSquare, Calendar, Phone, Plus, Edit2, CalendarX } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function GuideManagement() {
  const [activeTab, setActiveTab] = useState('guides');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    guideId: '',
    guideName: '',
    date: '',
    timeSlot: '08:00-12:00',
  });

  const { guides, guideSchedules, addGuideSchedule, updateGuideStatus, deleteGuideSchedule } = useStore();

  const guideTableData = guides.map(guide => ({
    id: guide.id,
    name: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-medium">
          {guide.name[0]}
        </div>
        <span>{guide.name}</span>
      </div>
    ),
    phone: (
      <span className="flex items-center gap-1 text-slate-600">
        <Phone className="w-3 h-3" />
        {guide.phone}
      </span>
    ),
    status: <Badge status={guide.status} type="guide" />,
  }));

  const guideColumns = [
    { key: 'name', label: '讲解员', align: 'left' as const },
    { key: 'phone', label: '联系电话', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const scheduleTableData = guideSchedules.map(schedule => ({
    id: schedule.id,
    guideName: schedule.guideName,
    date: schedule.date,
    timeSlot: schedule.timeSlot,
  }));

  const scheduleColumns = [
    { key: 'guideName', label: '讲解员', align: 'left' as const },
    { key: 'date', label: '日期', align: 'center' as const },
    { key: 'timeSlot', label: '时段', align: 'center' as const },
  ];

  const guideActions = (row: Record<string, any>) => {
    const guide = guides.find(g => g.id === row.id);
    if (!guide) return null;
    
    return (
      <>
        <button 
          onClick={() => {
            const newStatus: Guide['status'] = guide.status === 'available' ? 'busy' : guide.status === 'busy' ? 'off' : 'available';
            updateGuideStatus(guide.id, newStatus);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
          title={guide.status === 'available' ? '设置为忙碌' : guide.status === 'busy' ? '设置为休息' : '设置为空闲'}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => updateGuideStatus(guide.id, 'off')}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
          title="请假"
        >
          <CalendarX className="w-4 h-4" />
        </button>
      </>
    );
  };

  const scheduleActions = (row: Record<string, any>) => (
    <>
      <button 
        onClick={() => deleteGuideSchedule(row.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
        title="删除排班"
      >
        <CalendarX className="w-4 h-4" />
      </button>
    </>
  );

  const handleAddSchedule = () => {
    const guide = guides.find(g => g.id === formData.guideId);
    if (!guide) return;
    addGuideSchedule({
      guideId: formData.guideId,
      guideName: guide.name,
      date: formData.date || '2024-01-15',
      timeSlot: formData.timeSlot,
    });
    setFormData({ guideId: '', guideName: '', date: '', timeSlot: '08:00-12:00' });
    setShowModal(false);
  };

  const availableGuides = guides.filter(g => g.status !== 'off');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">讲解服务</h1>
          <p className="text-slate-500 mt-1">管理讲解员排班与任务调度</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>排班</span>
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'guides' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>讲解员列表</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>排班管理</span>
        </button>
      </div>

      {activeTab === 'guides' && (
        <Table columns={guideColumns} data={guideTableData} rowActions={guideActions} />
      )}

      {activeTab === 'schedule' && (
        <Table columns={scheduleColumns} data={scheduleTableData} rowActions={scheduleActions} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增排班">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">选择讲解员</label>
            <select 
              value={formData.guideId}
              onChange={(e) => {
                const guide = guides.find(g => g.id === e.target.value);
                setFormData({...formData, guideId: e.target.value, guideName: guide?.name || ''});
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">请选择讲解员</option>
              {availableGuides.map(guide => (
                <option key={guide.id} value={guide.id}>{guide.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                <option>08:00-12:00</option>
                <option>13:00-17:00</option>
                <option>09:00-13:00</option>
                <option>14:00-18:00</option>
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
            <button 
              onClick={handleAddSchedule}
              disabled={!formData.guideId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认排班
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

type Guide = {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'off';
};