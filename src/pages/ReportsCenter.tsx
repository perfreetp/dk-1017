import { useState } from 'react';
import { BarChart3, Store, Users, TrendingUp, Download, Calendar, Shield } from 'lucide-react';
import { Table } from '../components/Common';
import { useStore } from '../store/useStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const { merchants, satisfactionData, dailyReports, flowData, exportDailyReport, user, switchRole } = useStore();

  const merchantTableData = merchants.map(merchant => ({
    id: merchant.id,
    name: merchant.name,
    category: merchant.category,
    status: (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        merchant.status === 'open' ? 'bg-green-100 text-green-700' :
        merchant.status === 'closed' ? 'bg-slate-100 text-slate-600' :
        'bg-red-100 text-red-700'
      }`}>
        {merchant.status === 'open' ? '营业中' : merchant.status === 'closed' ? '休息' : '异常'}
      </span>
    ),
    revenue: merchant.revenue ? `${merchant.revenue.toLocaleString()}元` : '-',
  }));

  const merchantColumns = [
    { key: 'name', label: '商户名称', align: 'left' as const },
    { key: 'category', label: '类别', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
    { key: 'revenue', label: '今日营收', align: 'right' as const },
  ];

  const limitTableData = flowData.map(area => {
    const rate = (area.visitorCount / area.capacity) * 100;
    return ({
      id: area.id,
      areaName: area.areaName,
      current: area.visitorCount,
      capacity: area.capacity,
      rate: (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${rate > 80 ? 'bg-red-500' : rate > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${rate > 80 ? 'text-red-600' : 'text-slate-600'}`}>
            {rate.toFixed(0)}%
          </span>
        </div>
      ),
      status: (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          rate > 90 ? 'bg-red-100 text-red-700' :
          rate > 80 ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {rate > 90 ? '限流中' : rate > 80 ? '预警' : '正常'}
        </span>
      ),
    });
  });

  const limitColumns = [
    { key: 'areaName', label: '区域名称', align: 'left' as const },
    { key: 'current', label: '当前客流', align: 'right' as const },
    { key: 'capacity', label: '承载上限', align: 'right' as const },
    { key: 'rate', label: '承载率', align: 'left' as const },
    { key: 'status', label: '状态', align: 'center' as const },
  ];

  const COLORS = ['#1E88E5', '#43A047', '#FB8C00', '#E53935', '#8E24AA'];

  const hasAdminAccess = user.role === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">报表中心</h1>
          <p className="text-slate-500 mt-1">数据分析与日报导出</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={exportDailyReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出日报</span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            <Shield className="w-4 h-4 text-slate-500" />
            <select
              value={user.role}
              onChange={(e) => switchRole(e.target.value as 'admin' | 'area_admin')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="admin">运营中心</option>
              <option value="area_admin">片区管理员</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>数据概览</span>
        </button>
        {hasAdminAccess && (
          <button
            onClick={() => setActiveTab('merchants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'merchants' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>商户状态</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('limits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'limits' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>限流管理</span>
        </button>
        <button
          onClick={() => setActiveTab('satisfaction')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'satisfaction' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>满意度统计</span>
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">近7日客流趋势</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="totalVisitors" stroke="#1e88e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">预约与投诉统计</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="bookings" fill="#1e88e5" name="预约数" />
                  <Bar dataKey="complaints" fill="#e53935" name="投诉数" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">工单完成情况</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="workOrdersCompleted" fill="#43a047" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">客流区域分布</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={flowData.map(a => ({ name: a.areaName, value: a.visitorCount }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {flowData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'merchants' && hasAdminAccess && (
        <Table columns={merchantColumns} data={merchantTableData} />
      )}

      {activeTab === 'merchants' && !hasAdminAccess && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-slate-500">片区管理员无商户状态查看权限</p>
        </div>
      )}

      {activeTab === 'limits' && (
        <Table columns={limitColumns} data={limitTableData} />
      )}

      {activeTab === 'satisfaction' && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">游客满意度趋势</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={[4, 5]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}分`, '满意度']}
                />
                <Line type="monotone" dataKey="score" stroke="#43a047" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-slate-500">平均满意度</p>
              <p className="text-4xl font-bold text-green-600">
                {(satisfactionData.reduce((sum, d) => sum + d.score, 0) / satisfactionData.length).toFixed(1)}
              </p>
              <p className="text-sm text-slate-400">近7日平均</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}