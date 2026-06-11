import { useState } from 'react';
import { ClipboardList, MapPin, AlertTriangle, CheckCircle, Clock, Plus, Edit2 } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function CleaningWorkOrder() {
  const [activeTab, setActiveTab] = useState('workorders');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningId, setAssigningId] = useState('');
  const [formData, setFormData] = useState<{
    type: 'cleaning' | 'inspection' | 'repair';
    location: string;
    priority: 'high' | 'normal' | 'low';
    assigneeId: string;
    assigneeName: string;
  }>({
    type: 'cleaning',
    location: '',
    priority: 'normal',
    assigneeId: '',
    assigneeName: '',
  });

  const { workOrders, inspections, createWorkOrder, assignWorkOrder, completeWorkOrder } = useStore();

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    normal: 'bg-yellow-100 text-yellow-700',
    low: 'bg-slate-100 text-slate-600',
  };

  const workOrderTableData = workOrders.map(order => ({
    id: order.id,
    type: order.type === 'cleaning' ? '清洁' : order.type === 'inspection' ? '巡检' : '维修',
    location: (
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3 text-slate-400" />
        {order.location}
      </span>
    ),
    priority: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[order.priority]}`}>
      <AlertTriangle className="w-3 h-3 mr-1" />
      {order.priority === 'high' ? '紧急' : order.priority === 'normal' ? '一般' : '低'}
    </span>,
    status: <Badge status={order.status} type="workorder" />,
    assignee: order.assigneeName || '待分派',
    createdAt: order.createdAt,
  }));

  const workOrderColumns = [
    { key: 'type', label: '类型', align: 'left' as const },
    { key: 'location', label: '位置', align: 'left' as const },
    { key: 'priority', label: '优先级', align: 'center' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'assignee', label: '责任人', align: 'left' as const },
    { key: 'createdAt', label: '创建时间', align: 'left' as const },
  ];

  const inspectionTableData = inspections.map(inspection => {
    const statusConfig = {
      clean: { label: '干净', class: 'bg-green-100 text-green-700' },
      dirty: { label: '需清洁', class: 'bg-yellow-100 text-yellow-700' },
      needs_repair: { label: '需维修', class: 'bg-red-100 text-red-700' },
    };
    return ({
      id: inspection.id,
      type: inspection.type === 'toilet' ? '卫生间' : '垃圾点',
      location: (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {inspection.location}
        </span>
      ),
      status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[inspection.status].class}`}>
        {statusConfig[inspection.status].label}
      </span>,
      inspectedAt: inspection.inspectedAt,
    });
  });

  const inspectionColumns = [
    { key: 'type', label: '类型', align: 'left' as const },
    { key: 'location', label: '位置', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'inspectedAt', label: '巡检时间', align: 'left' as const },
  ];

  const rowActions = (row: Record<string, any>) => {
    const order = workOrders.find(w => w.id === row.id);
    if (!order) return null;
    
    return (
      <>
        {order.status === 'pending' && (
          <button 
            onClick={() => {
              setAssigningId(order.id);
              setShowAssignModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            title="分派"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {(order.status === 'pending' || order.status === 'processing') && (
          <button 
            onClick={() => completeWorkOrder(order.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
            title="完成"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  const handleCreateWorkOrder = () => {
    createWorkOrder({
      type: formData.type,
      location: formData.location,
      priority: formData.priority,
      status: 'pending',
      assigneeId: '',
    });
    setFormData({ type: 'cleaning', location: '', priority: 'normal', assigneeId: '', assigneeName: '' });
    setShowModal(false);
  };

  const handleAssignWorkOrder = () => {
    assignWorkOrder(assigningId, formData.assigneeId, formData.assigneeName);
    setShowAssignModal(false);
    setAssigningId('');
    setFormData({ ...formData, assigneeId: '', assigneeName: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">保洁工单</h1>
          <p className="text-slate-500 mt-1">管理厕所与垃圾点巡查及工单分派</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>创建工单</span>
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('workorders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'workorders' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>工单管理</span>
        </button>
        <button
          onClick={() => setActiveTab('inspections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'inspections' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>巡查记录</span>
        </button>
      </div>

      {activeTab === 'workorders' && (
        <Table columns={workOrderColumns} data={workOrderTableData} rowActions={rowActions} />
      )}

      {activeTab === 'inspections' && (
        <Table columns={inspectionColumns} data={inspectionTableData} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="创建工单">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">工单类型</label>
            <select 
              value={formData.type}
              onChange={(e) => {
                const newFormData = {...formData} as {type: 'cleaning' | 'inspection' | 'repair', location: string, priority: 'high' | 'normal' | 'low', assigneeId: string, assigneeName: string};
                newFormData.type = e.target.value as 'cleaning' | 'inspection' | 'repair';
                setFormData(newFormData);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="cleaning">清洁</option>
              <option value="inspection">巡检</option>
              <option value="repair">维修</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">位置</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="请输入位置" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">优先级</label>
            <select 
              value={formData.priority}
              onChange={(e) => {
                const newFormData = {...formData} as {type: 'cleaning' | 'inspection' | 'repair', location: string, priority: 'high' | 'normal' | 'low', assigneeId: string, assigneeName: string};
                newFormData.priority = e.target.value as 'high' | 'normal' | 'low';
                setFormData(newFormData);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="high">紧急</option>
              <option value="normal">一般</option>
              <option value="low">低</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleCreateWorkOrder}
              disabled={!formData.location}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认创建
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => { setShowAssignModal(false); setAssigningId(''); }} title="分派工单">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">选择责任人</label>
            <select 
              value={formData.assigneeId}
              onChange={(e) => {
                const name = e.target.options[e.target.selectedIndex].text;
                setFormData({...formData, assigneeId: e.target.value, assigneeName: name});
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">请选择责任人</option>
              <option value="u1">保洁员A</option>
              <option value="u2">保洁员B</option>
              <option value="u3">保洁员C</option>
              <option value="u4">巡检员A</option>
              <option value="u5">巡检员B</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => { setShowAssignModal(false); setAssigningId(''); }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleAssignWorkOrder}
              disabled={!formData.assigneeId}
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