import { useState } from 'react';
import { MessageCircle, Package, Radio, Plus, Send, CheckCircle } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { complaints, lostItems, broadcasts } from '../data/mockData';

export default function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState('complaints');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'complaint' | 'lostitem' | 'broadcast'>('complaint');

  const complaintTableData = complaints.map(complaint => ({
    id: complaint.id,
    userName: complaint.userName,
    content: complaint.content,
    status: <Badge status={complaint.status} type="complaint" />,
    assignee: complaint.assigneeName || '待分派',
    createdAt: complaint.createdAt,
  }));

  const complaintColumns = [
    { key: 'userName', label: '游客', align: 'left' as const },
    { key: 'content', label: '内容', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'assignee', label: '责任人', align: 'left' as const },
    { key: 'createdAt', label: '创建时间', align: 'left' as const },
  ];

  const lostItemTableData = lostItems.map(item => ({
    id: item.id,
    name: item.name,
    userName: item.userName,
    description: item.description,
    location: item.location,
    status: <Badge status={item.status} type="lostitem" />,
    createdAt: item.createdAt,
  }));

  const lostItemColumns = [
    { key: 'name', label: '物品名称', align: 'left' as const },
    { key: 'userName', label: '登记人', align: 'left' as const },
    { key: 'description', label: '描述', align: 'left' as const },
    { key: 'location', label: '发现地点', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'createdAt', label: '登记时间', align: 'left' as const },
  ];

  const broadcastTableData = broadcasts.map(broadcast => ({
    id: broadcast.id,
    content: broadcast.content,
    area: broadcast.area,
    operatorName: broadcast.operatorName,
    broadcastAt: broadcast.broadcastAt,
  }));

  const broadcastColumns = [
    { key: 'content', label: '广播内容', align: 'left' as const },
    { key: 'area', label: '广播区域', align: 'center' as const },
    { key: 'operatorName', label: '操作员', align: 'left' as const },
    { key: 'broadcastAt', label: '广播时间', align: 'left' as const },
  ];

  const complaintActions = () => (
    <>
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="分派">
        <Send className="w-4 h-4" />
      </button>
      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="完成">
        <CheckCircle className="w-4 h-4" />
      </button>
    </>
  );

  const lostItemActions = () => (
    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="标记已认领">
      <CheckCircle className="w-4 h-4" />
    </button>
  );

  const openModal = (type: 'complaint' | 'lostitem' | 'broadcast') => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">游客反馈</h1>
          <p className="text-slate-500 mt-1">管理投诉、遗失物品与应急广播</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal('complaint')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>投诉</span>
          </button>
          <button
            onClick={() => openModal('lostitem')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>遗失物</span>
          </button>
          <button
            onClick={() => openModal('broadcast')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>广播</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'complaints' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>投诉处理</span>
        </button>
        <button
          onClick={() => setActiveTab('lostitems')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'lostitems' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>遗失物品</span>
        </button>
        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'broadcasts' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>应急广播</span>
        </button>
      </div>

      {activeTab === 'complaints' && (
        <Table columns={complaintColumns} data={complaintTableData} rowActions={complaintActions} />
      )}

      {activeTab === 'lostitems' && (
        <Table columns={lostItemColumns} data={lostItemTableData} rowActions={lostItemActions} />
      )}

      {activeTab === 'broadcasts' && (
        <Table columns={broadcastColumns} data={broadcastTableData} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={
        modalType === 'complaint' ? '登记投诉' : modalType === 'lostitem' ? '登记遗失物品' : '发布广播'
      }>
        <div className="space-y-4">
          {modalType === 'complaint' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">游客姓名</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入游客姓名" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">投诉内容</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={4} placeholder="请描述投诉内容" />
              </div>
            </>
          )}
          {modalType === 'lostitem' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">物品名称</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入物品名称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">物品描述</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="请描述物品特征" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">发现地点</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入发现地点" />
              </div>
            </>
          )}
          {modalType === 'broadcast' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">广播内容</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={4} placeholder="请输入广播内容" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">广播区域</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>全景区</option>
                  <option>断桥</option>
                  <option>苏堤</option>
                  <option>白堤</option>
                  <option>雷峰塔</option>
                  <option>游船码头</option>
                </select>
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {modalType === 'broadcast' ? '发布广播' : '确认登记'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}