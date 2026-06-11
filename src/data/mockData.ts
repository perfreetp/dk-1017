import type {
  User,
  Booking,
  FlowData,
  Cruise,
  CruiseSchedule,
  Guide,
  GuideSchedule,
  WorkOrder,
  Inspection,
  Complaint,
  LostItem,
  Broadcast,
  Merchant,
  SatisfactionData,
  DailyReport,
  Warning,
} from './types';

export const currentUser: User = {
  id: '1',
  username: '张管理员',
  role: 'admin',
  department: '运营中心',
};

export const bookings: Booking[] = [
  { id: '1', userId: 'u1', entryPoint: '断桥入口', visitDate: '2024-01-15', timeSlot: '09:00-10:00', status: 'pending', createdAt: '2024-01-14 10:30' },
  { id: '2', userId: 'u2', entryPoint: '苏堤入口', visitDate: '2024-01-15', timeSlot: '10:00-11:00', status: 'verified', createdAt: '2024-01-14 11:00' },
  { id: '3', userId: 'u3', entryPoint: '白堤入口', visitDate: '2024-01-15', timeSlot: '11:00-12:00', status: 'pending', createdAt: '2024-01-14 14:20' },
  { id: '4', userId: 'u4', entryPoint: '曲院风荷', visitDate: '2024-01-15', timeSlot: '09:00-10:00', status: 'cancelled', createdAt: '2024-01-13 09:00' },
  { id: '5', userId: 'u5', entryPoint: '断桥入口', visitDate: '2024-01-15', timeSlot: '14:00-15:00', status: 'pending', createdAt: '2024-01-14 16:00' },
];

export const flowData: FlowData[] = [
  { id: '1', areaId: 'a1', areaName: '断桥', visitorCount: 856, capacity: 1000, timestamp: '2024-01-15 10:30:00' },
  { id: '2', areaId: 'a2', areaName: '苏堤', visitorCount: 1200, capacity: 1500, timestamp: '2024-01-15 10:30:00' },
  { id: '3', areaId: 'a3', areaName: '白堤', visitorCount: 680, capacity: 800, timestamp: '2024-01-15 10:30:00' },
  { id: '4', areaId: 'a4', areaName: '雷峰塔', visitorCount: 1500, capacity: 2000, timestamp: '2024-01-15 10:30:00' },
  { id: '5', areaId: 'a5', areaName: '曲院风荷', visitorCount: 450, capacity: 600, timestamp: '2024-01-15 10:30:00' },
  { id: '6', areaId: 'a6', areaName: '花港观鱼', visitorCount: 720, capacity: 850, timestamp: '2024-01-15 10:30:00' },
  { id: '7', areaId: 'a7', areaName: '岳庙', visitorCount: 380, capacity: 500, timestamp: '2024-01-15 10:30:00' },
  { id: '8', areaId: 'a8', areaName: '三潭印月', visitorCount: 920, capacity: 1000, timestamp: '2024-01-15 10:30:00' },
];

export const cruises: Cruise[] = [
  { id: 'c1', name: '西湖一号', capacity: 50, status: 'sailing', location: { lat: 30.2741, lng: 120.1552 } },
  { id: 'c2', name: '西湖二号', capacity: 45, status: 'available', location: { lat: 30.2700, lng: 120.1600 } },
  { id: 'c3', name: '西湖三号', capacity: 60, status: 'sailing', location: { lat: 30.2680, lng: 120.1580 } },
  { id: 'c4', name: '西湖四号', capacity: 40, status: 'maintenance', location: { lat: 30.2720, lng: 120.1560 } },
];

export const cruiseSchedules: CruiseSchedule[] = [
  { id: 'cs1', cruiseId: 'c1', cruiseName: '西湖一号', departureTime: '08:30', status: 'departed' },
  { id: 'cs2', cruiseId: 'c1', cruiseName: '西湖一号', departureTime: '10:00', status: 'scheduled' },
  { id: 'cs3', cruiseId: 'c2', cruiseName: '西湖二号', departureTime: '09:00', status: 'departed' },
  { id: 'cs4', cruiseId: 'c2', cruiseName: '西湖二号', departureTime: '10:30', status: 'scheduled' },
  { id: 'cs5', cruiseId: 'c3', cruiseName: '西湖三号', departureTime: '08:00', status: 'departed' },
  { id: 'cs6', cruiseId: 'c3', cruiseName: '西湖三号', departureTime: '11:00', status: 'scheduled' },
];

export const guides: Guide[] = [
  { id: 'g1', name: '李导游', phone: '13800138001', status: 'busy' },
  { id: 'g2', name: '王导游', phone: '13800138002', status: 'available' },
  { id: 'g3', name: '赵导游', phone: '13800138003', status: 'available' },
  { id: 'g4', name: '刘导游', phone: '13800138004', status: 'off' },
  { id: 'g5', name: '陈导游', phone: '13800138005', status: 'busy' },
];

export const guideSchedules: GuideSchedule[] = [
  { id: 'gs1', guideId: 'g1', guideName: '李导游', date: '2024-01-15', timeSlot: '08:00-12:00' },
  { id: 'gs2', guideId: 'g1', guideName: '李导游', date: '2024-01-15', timeSlot: '13:00-17:00' },
  { id: 'gs3', guideId: 'g2', guideName: '王导游', date: '2024-01-15', timeSlot: '08:00-12:00' },
  { id: 'gs4', guideId: 'g3', guideName: '赵导游', date: '2024-01-15', timeSlot: '13:00-17:00' },
  { id: 'gs5', guideId: 'g5', guideName: '陈导游', date: '2024-01-15', timeSlot: '09:00-13:00' },
];

export const workOrders: WorkOrder[] = [
  { id: 'w1', type: 'cleaning', location: '断桥卫生间', priority: 'high', status: 'completed', assigneeId: 'u1', assigneeName: '保洁员A', createdAt: '2024-01-15 08:00' },
  { id: 'w2', type: 'inspection', location: '苏堤垃圾点', priority: 'normal', status: 'processing', assigneeId: 'u2', assigneeName: '巡检员B', createdAt: '2024-01-15 09:30' },
  { id: 'w3', type: 'repair', location: '白堤卫生间', priority: 'high', status: 'pending', assigneeId: '', createdAt: '2024-01-15 10:00' },
  { id: 'w4', type: 'cleaning', location: '雷峰塔卫生间', priority: 'normal', status: 'processing', assigneeId: 'u3', assigneeName: '保洁员C', createdAt: '2024-01-15 09:45' },
  { id: 'w5', type: 'inspection', location: '曲院风荷垃圾点', priority: 'low', status: 'pending', assigneeId: '', createdAt: '2024-01-15 10:20' },
];

export const inspections: Inspection[] = [
  { id: 'i1', type: 'toilet', location: '断桥卫生间', status: 'clean', inspectorId: 'u1', inspectedAt: '2024-01-15 08:30' },
  { id: 'i2', type: 'garbage', location: '苏堤垃圾点', status: 'dirty', inspectorId: 'u2', inspectedAt: '2024-01-15 09:15' },
  { id: 'i3', type: 'toilet', location: '白堤卫生间', status: 'needs_repair', inspectorId: 'u1', inspectedAt: '2024-01-15 09:00' },
  { id: 'i4', type: 'garbage', location: '雷峰塔垃圾点', status: 'clean', inspectorId: 'u2', inspectedAt: '2024-01-15 08:45' },
];

export const complaints: Complaint[] = [
  { id: 'cp1', userId: 'u1', userName: '游客A', content: '卫生间卫生状况不佳', status: 'resolved', assigneeId: 'u2', assigneeName: '管理员B', createdAt: '2024-01-14 14:30' },
  { id: 'cp2', userId: 'u2', userName: '游客B', content: '游船等待时间过长', status: 'assigned', assigneeId: 'u3', assigneeName: '管理员C', createdAt: '2024-01-15 09:20' },
  { id: 'cp3', userId: 'u3', userName: '游客C', content: '讲解服务预约困难', status: 'pending', createdAt: '2024-01-15 10:15' },
  { id: 'cp4', userId: 'u4', userName: '游客D', content: '景区指示牌不清晰', status: 'pending', createdAt: '2024-01-15 10:30' },
];

export const lostItems: LostItem[] = [
  { id: 'l1', userId: 'u1', userName: '游客A', name: '手机', description: '黑色iPhone 14', location: '断桥', status: 'unclaimed', createdAt: '2024-01-14 16:00' },
  { id: 'l2', userId: 'u2', userName: '游客B', name: '钱包', description: '棕色皮质钱包', location: '苏堤', status: 'claimed', createdAt: '2024-01-13 11:30' },
  { id: 'l3', userId: 'u3', userName: '游客C', name: '背包', description: '蓝色双肩包', location: '雷峰塔', status: 'unclaimed', createdAt: '2024-01-15 09:45' },
];

export const broadcasts: Broadcast[] = [
  { id: 'b1', content: '请注意，雷峰塔区域客流较大，请游客有序参观', area: '雷峰塔', broadcastAt: '2024-01-15 09:00', operatorId: 'u1', operatorName: '张管理员' },
  { id: 'b2', content: '游船码头即将发船，请游客尽快登船', area: '游船码头', broadcastAt: '2024-01-15 08:25', operatorId: 'u2', operatorName: '李管理员' },
  { id: 'b3', content: '今日景区开放时间延长至18:00', area: '全景区', broadcastAt: '2024-01-15 08:00', operatorId: 'u1', operatorName: '张管理员' },
];

export const merchants: Merchant[] = [
  { id: 'm1', name: '西湖茶楼', category: '餐饮', status: 'open', revenue: 12500 },
  { id: 'm2', name: '纪念品商店', category: '零售', status: 'open', revenue: 8300 },
  { id: 'm3', name: '咖啡厅', category: '餐饮', status: 'closed', revenue: 0 },
  { id: 'm4', name: '特色小吃', category: '餐饮', status: 'open', revenue: 5600 },
  { id: 'm5', name: '文创店', category: '零售', status: 'exception', revenue: 0 },
];

export const satisfactionData: SatisfactionData[] = [
  { date: '01-09', score: 4.6, count: 234 },
  { date: '01-10', score: 4.5, count: 312 },
  { date: '01-11', score: 4.7, count: 287 },
  { date: '01-12', score: 4.4, count: 265 },
  { date: '01-13', score: 4.8, count: 342 },
  { date: '01-14', score: 4.6, count: 298 },
  { date: '01-15', score: 4.7, count: 189 },
];

export const dailyReports: DailyReport[] = [
  { date: '01-09', totalVisitors: 12580, bookings: 3256, complaints: 12, lostItems: 8, workOrdersCompleted: 45 },
  { date: '01-10', totalVisitors: 15620, bookings: 4120, complaints: 18, lostItems: 12, workOrdersCompleted: 52 },
  { date: '01-11', totalVisitors: 13890, bookings: 3680, complaints: 15, lostItems: 9, workOrdersCompleted: 48 },
  { date: '01-12', totalVisitors: 11230, bookings: 2890, complaints: 10, lostItems: 6, workOrdersCompleted: 38 },
  { date: '01-13', totalVisitors: 18920, bookings: 5120, complaints: 22, lostItems: 15, workOrdersCompleted: 65 },
  { date: '01-14', totalVisitors: 16540, bookings: 4350, complaints: 16, lostItems: 11, workOrdersCompleted: 58 },
  { date: '01-15', totalVisitors: 9850, bookings: 2650, complaints: 8, lostItems: 5, workOrdersCompleted: 32 },
];

export const warnings: Warning[] = [
  { id: 'w1', type: 'crowd', area: '三潭印月', level: 'warning', message: '当前客流接近承载上限', timestamp: '2024-01-15 10:25:00' },
  { id: 'w2', type: 'queue', area: '断桥入口', level: 'alert', message: '排队人数超过200人', timestamp: '2024-01-15 10:15:00' },
  { id: 'w3', type: 'maintenance', area: '西湖四号游船', level: 'warning', message: '游船维护中，暂停服务', timestamp: '2024-01-15 08:00:00' },
];