export interface User {
  id: string;
  username: string;
  role: 'admin' | 'area_admin';
  department: string;
}

export interface Booking {
  id: string;
  userId: string;
  entryPoint: string;
  visitDate: string;
  timeSlot: string;
  status: 'pending' | 'verified' | 'cancelled';
  createdAt: string;
}

export interface FlowData {
  id: string;
  areaId: string;
  areaName: string;
  visitorCount: number;
  capacity: number;
  timestamp: string;
}

export interface Cruise {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'sailing' | 'maintenance';
  location: { lat: number; lng: number };
}

export interface CruiseSchedule {
  id: string;
  cruiseId: string;
  cruiseName: string;
  departureTime: string;
  status: 'scheduled' | 'departed' | 'cancelled';
}

export interface Guide {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'off';
}

export interface GuideSchedule {
  id: string;
  guideId: string;
  guideName: string;
  date: string;
  timeSlot: string;
}

export interface WorkOrder {
  id: string;
  type: 'cleaning' | 'inspection' | 'repair';
  location: string;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed';
  assigneeId: string;
  assigneeName?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  type: 'toilet' | 'garbage';
  location: string;
  status: 'clean' | 'dirty' | 'needs_repair';
  inspectorId: string;
  inspectedAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  content: string;
  status: 'pending' | 'assigned' | 'resolved';
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
}

export interface LostItem {
  id: string;
  userId: string;
  userName: string;
  name: string;
  description: string;
  location: string;
  status: 'unclaimed' | 'claimed';
  createdAt: string;
}

export interface Broadcast {
  id: string;
  content: string;
  area: string;
  broadcastAt: string;
  operatorId: string;
  operatorName: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  status: 'open' | 'closed' | 'exception';
  revenue?: number;
}

export interface SatisfactionData {
  date: string;
  score: number;
  count: number;
}

export interface DailyReport {
  date: string;
  totalVisitors: number;
  bookings: number;
  complaints: number;
  lostItems: number;
  workOrdersCompleted: number;
}

export interface Warning {
  id: string;
  type: 'crowd' | 'queue' | 'maintenance';
  area: string;
  level: 'warning' | 'alert';
  message: string;
  timestamp: string;
}