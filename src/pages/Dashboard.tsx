import { Users, CalendarCheck, AlertTriangle, TrendingUp, MapPin, Clock } from 'lucide-react';
import { StatCard, WarningCard } from '../components/Common';
import { flowData, warnings, dailyReports } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const totalVisitors = flowData.reduce((sum, item) => sum + item.visitorCount, 0);
  const totalCapacity = flowData.reduce((sum, item) => sum + item.capacity, 0);
  const occupancyRate = ((totalVisitors / totalCapacity) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">态势总览</h1>
          <p className="text-slate-500 mt-1">实时监控西湖景区客流与服务状态</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">更新于 10:30</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="今日客流"
          value={totalVisitors.toLocaleString()}
          icon={<Users className="w-6 h-6 text-white" />}
          trend={{ value: 12.5, isUp: true }}
          color="blue"
        />
        <StatCard
          title="预约人数"
          value={2650}
          icon={<CalendarCheck className="w-6 h-6 text-white" />}
          trend={{ value: 8.3, isUp: true }}
          color="green"
        />
        <StatCard
          title="客流承载率"
          value={`${occupancyRate}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color={parseFloat(occupancyRate) > 80 ? 'orange' : 'green'}
        />
        <StatCard
          title="预警数量"
          value={warnings.length}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color={warnings.some(w => w.level === 'alert') ? 'red' : 'orange'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">客流热力分布</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flowData.map((area) => {
              const rate = (area.visitorCount / area.capacity) * 100;
              const bgColor = rate > 80 
                ? 'bg-red-100 border-red-300' 
                : rate > 60 
                  ? 'bg-yellow-100 border-yellow-300' 
                  : 'bg-green-100 border-green-300';
              const textColor = rate > 80 ? 'text-red-600' : rate > 60 ? 'text-yellow-600' : 'text-green-600';
              
              return (
                <div
                  key={area.id}
                  className={`p-3 rounded-lg border-2 ${bgColor} transition-all hover:scale-105`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-4 h-4 ${textColor}`} />
                    <span className="text-sm font-medium text-slate-700">{area.areaName}</span>
                  </div>
                  <p className={`text-xl font-bold ${textColor}`}>{area.visitorCount}</p>
                  <p className="text-xs text-slate-500">{rate.toFixed(0)}% 承载</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">实时预警</h2>
          {warnings.map((warning) => (
            <WarningCard key={warning.id} warning={warning} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">近7日客流趋势</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="totalVisitors" 
                stroke="#1e88e5" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, fill: '#1e88e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}