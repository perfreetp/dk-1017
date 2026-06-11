import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Package, Radio, Plus, CheckCircle, Edit2, Clock, Sparkles, X } from 'lucide-react';
import { Badge, Table, Modal } from '../components/Common';
import { useStore } from '../store/useStore';

export default function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState('complaints');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningId, setAssigningId] = useState('');
  const [modalType, setModalType] = useState<'complaint' | 'lostitem' | 'broadcast'>('complaint');
  const [recentlyHighlighted, setRecentlyHighlighted] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    content: '',
    name: '',
    description: '',
    location: '',
    area: '全景区',
    assigneeId: '',
    assigneeName: '',
  });

  const { complaints, lostItems, broadcasts, recentlyProcessed, addComplaint, assignComplaint, resolveComplaint, addLostItem, claimLostItem, addBroadcast, clearRecentlyProcessed } = useStore();

  useEffect(() => {
    if (recentlyProcessed.length > 0) {
      const latest = recentlyProcessed[0];
      if (latest.type === 'complaint' && activeTab === 'complaints') {
        const complaint = complaints.find(c => c.content.includes(latest.content.replace('投诉 - ', '')));
        if (complaint) setRecentlyHighlighted(complaint.id);
      } else if (latest.type === 'lostitem' && activeTab === 'lostitems') {
        const item = lostItems.find(l => l.name.includes(latest.content.replace('遗失物品 - ', '')));
        if (item) setRecentlyHighlighted(item.id);
      } else if (latest.type === 'broadcast' && activeTab === 'broadcasts') {
        const broadcast = broadcasts.find(b => b.content.includes(latest.content.replace('广播 - ', '')));
        if (broadcast) setRecentlyHighlighted(broadcast.id);
      }
      
      const timer = setTimeout(() => setRecentlyHighlighted(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [recentlyProcessed, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'complaints') {
      const latestComplaint = recentlyProcessed.find(p => p.type === 'complaint');
      if (latestComplaint) {
        const complaint = complaints.find(c => c.content.includes(latestComplaint.content.replace('投诉 - ', '')));
        if (complaint) setRecentlyHighlighted(complaint.id);
      }
    } else if (tab === 'lostitems') {
      const latestLostItem = recentlyProcessed.find(p => p.type === 'lostitem');
      if (latestLostItem) {
        const item = lostItems.find(l => l.name.includes(latestLostItem.content.replace('遗失物品 - ', '')));
        if (item) setRecentlyHighlighted(item.id);
      }
    } else if (tab === 'broadcasts') {
      const latestBroadcast = recentlyProcessed.find(p => p.type === 'broadcast');
      if (latestBroadcast) {
        const broadcast = broadcasts.find(b => b.content.includes(latestBroadcast.content.replace('广播 - ', '')));
        if (broadcast) setRecentlyHighlighted(broadcast.id);
      }
    }
  };

  const complaintTableData = complaints.map(complaint => ({
    id: complaint.id,
    userName: complaint.userName,
    content: complaint.content,
    status: <Badge status={complaint.status} type="complaint" />,
    assignee: complaint.assigneeName || '待分派',
    createdAt: complaint.createdAt,
    isHighlighted: recentlyHighlighted === complaint.id,
  }));

  const lostItemTableData = lostItems.map(item => ({
    id: item.id,
    name: item.name,
    userName: item.userName,
    description: item.description,
    location: item.location,
    status: <Badge status={item.status} type="lostitem" />,
    createdAt: item.createdAt,
    isHighlighted: recentlyHighlighted === item.id,
  }));

  const broadcastTableData = broadcasts.map(broadcast => ({
    id: broadcast.id,
    content: broadcast.content,
    area: broadcast.area,
    operatorName: broadcast.operatorName,
    broadcastAt: broadcast.broadcastAt,
    isHighlighted: recentlyHighlighted === broadcast.id,
  }));

  const complaintColumns = [
    { key: 'userName', label: '游客', align: 'left' as const },
    { key: 'content', label: '内容', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'assignee', label: '责任人', align: 'left' as const },
    { key: 'createdAt', label: '创建时间', align: 'left' as const },
  ];

  const lostItemColumns = [
    { key: 'name', label: '物品名称', align: 'left' as const },
    { key: 'userName', label: '登记人', align: 'left' as const },
    { key: 'description', label: '描述', align: 'left' as const },
    { key: 'location', label: '发现地点', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'createdAt', label: '登记时间', align: 'left' as const },
  ];

  const broadcastColumns = [
    { key: 'content', label: '广播内容', align: 'left' as const },
    { key: 'area', label: '广播区域', align: 'center' as const },
    { key: 'operatorName', label: '操作员', align: 'left' as const },
    { key: 'broadcastAt', label: '广播时间', align: 'left' as const },
  ];

  const complaintActions = (row: Record<string, any>) => {
    const complaint = complaints.find(c => c.id === row.id);
    if (!complaint) return null;
    
    return (
      <>
        {complaint.status !== 'resolved' && complaint.status !== 'assigned' && (
          <button 
            onClick={() => {
              setAssigningId(complaint.id);
              setShowAssignModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            title="分派"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {complaint.status !== 'resolved' && (
          <button 
            onClick={() => resolveComplaint(complaint.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
            title="完成"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </>
    );
  };

  const lostItemActions = (row: Record<string, any>) => {
    const item = lostItems.find(l => l.id === row.id);
    if (!item || item.status === 'claimed') return null;
    
    return (
      <button 
        onClick={() => claimLostItem(item.id)}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
        title="标记已认领"
      >
        <CheckCircle className="w-4 h-4" />
      </button>
    );
  };

  const openModal = (type: 'complaint' | 'lostitem' | 'broadcast') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (modalType === 'complaint') {
      addComplaint({
        userId: 'new_user',
        userName: formData.userName,
        content: formData.content,
        status: 'pending',
      });
      setActiveTab('complaints');
    } else if (modalType === 'lostitem') {
      addLostItem({
        userId: 'new_user',
        userName: formData.userName,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        status: 'unclaimed',
      });
      setActiveTab('lostitems');
    } else {
      addBroadcast({
        content: formData.content,
        area: formData.area,
        broadcastAt: new Date().toLocaleString(),
        operatorId: 'admin',
        operatorName: '张管理员',
      });
      setActiveTab('broadcasts');
    }
    setFormData({ userName: '', content: '', name: '', description: '', location: '', area: '全景区', assigneeId: '', assigneeName: '' });
    setShowModal(false);
  };

  const handleAssignComplaint = () => {
    assignComplaint(assigningId, formData.assigneeId, formData.assigneeName);
    setShowAssignModal(false);
    setAssigningId('');
    setFormData({ ...formData, assigneeId: '', assigneeName: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {recentlyProcessed.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">最近处理</span>
            </div>
            <button 
              onClick={clearRecentlyProcessed}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="清除记录"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {recentlyProcessed.slice(0, 5).map((item, index) => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  index === 0 ? 'bg-white shadow-sm animate-pulse' : 'bg-white/50'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700 flex-1">{item.content}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.action.includes('分派') ? 'bg-blue-100 text-blue-700' :
                  item.action.includes('解决') || item.action.includes('认领') ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {item.action}
                </span>
                <span className="text-xs text-slate-400">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          onClick={() => handleTabChange('complaints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'complaints' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>投诉处理</span>
          {recentlyProcessed.some(p => p.type === 'complaint') && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
        <button
          onClick={() => handleTabChange('lostitems')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'lostitems' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>遗失物品</span>
          {recentlyProcessed.some(p => p.type === 'lostitem') && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
        <button
          onClick={() => handleTabChange('broadcasts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'broadcasts' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>应急广播</span>
          {recentlyProcessed.some(p => p.type === 'broadcast') && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === 'complaints' && (
        <div className="relative">
          <Table columns={complaintColumns} data={complaintTableData} rowActions={complaintActions} />
          {recentlyHighlighted && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute border-2 border-blue-500 rounded-xl animate-ping w-full h-full opacity-50" />
            </div>
          )}
        </div>
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
                <input 
                  type="text" 
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="请输入游客姓名" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">投诉内容</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={4} 
                  placeholder="请描述投诉内容" 
                />
              </div>
            </>
          )}
          {modalType === 'lostitem' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">登记人姓名</label>
                <input 
                  type="text" 
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="请输入登记人姓名" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">物品名称</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="请输入物品名称" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">物品描述</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={3} 
                  placeholder="请描述物品特征" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">发现地点</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="请输入发现地点" 
                />
              </div>
            </>
          )}
          {modalType === 'broadcast' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">广播内容</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={4} 
                  placeholder="请输入广播内容" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">广播区域</label>
                <select 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
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
            <button 
              onClick={handleSubmit}
              disabled={modalType === 'complaint' && (!formData.userName || !formData.content) ||
                       modalType === 'lostitem' && (!formData.userName || !formData.name) ||
                       modalType === 'broadcast' && !formData.content}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {modalType === 'broadcast' ? '发布广播' : '确认登记'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => { setShowAssignModal(false); setAssigningId(''); }} title="分派投诉">
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
              <option value="u1">管理员A</option>
              <option value="u2">管理员B</option>
              <option value="u3">管理员C</option>
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
              onClick={handleAssignComplaint}
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