import { create } from 'zustand';
import type {
  User,
  Booking,
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
  FlowData,
} from '../data/types';
import {
  bookings as initialBookings,
  cruises as initialCruises,
  cruiseSchedules as initialCruiseSchedules,
  guides as initialGuides,
  guideSchedules as initialGuideSchedules,
  workOrders as initialWorkOrders,
  inspections as initialInspections,
  complaints as initialComplaints,
  lostItems as initialLostItems,
  broadcasts as initialBroadcasts,
  merchants as initialMerchants,
  satisfactionData as initialSatisfactionData,
  dailyReports as initialDailyReports,
  warnings as initialWarnings,
  currentUser as initialCurrentUser,
  flowData as initialFlowData,
} from '../data/mockData';

export interface BookingWithServices extends Booking {
  hasGuideService?: boolean;
  hasCruiseService?: boolean;
  guideScheduleId?: string;
  cruiseScheduleId?: string;
  passengerCount?: number;
}

export interface CruiseReservation {
  id: string;
  scheduleId: string;
  passengerCount: number;
  bookingId?: string;
  status: 'confirmed' | 'pending_reschedule' | 'cancelled';
}

export interface RecentlyProcessed {
  id: string;
  type: 'complaint' | 'lostitem' | 'broadcast' | 'booking' | 'workorder';
  content: string;
  timestamp: string;
  action: string;
}

export interface AreaData {
  areaId: string;
  areaName: string;
  visitorCount: number;
  capacity: number;
  complaints: number;
  workOrders: number;
}

interface AppState {
  user: User;
  userArea: string;
  bookings: BookingWithServices[];
  cruises: Cruise[];
  cruiseSchedules: CruiseSchedule[];
  cruiseReservations: CruiseReservation[];
  guides: Guide[];
  guideSchedules: GuideSchedule[];
  workOrders: WorkOrder[];
  inspections: Inspection[];
  complaints: Complaint[];
  lostItems: LostItem[];
  broadcasts: Broadcast[];
  merchants: Merchant[];
  satisfactionData: SatisfactionData[];
  dailyReports: DailyReport[];
  warnings: Warning[];
  flowData: FlowData[];
  recentlyProcessed: RecentlyProcessed[];

  verifyBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  addBooking: (booking: Omit<BookingWithServices, 'id' | 'createdAt'>) => void;
  updateBookingServices: (id: string, services: Partial<BookingWithServices>) => void;
  rescheduleReservations: (scheduleId: string) => void;

  addCruiseSchedule: (schedule: Omit<CruiseSchedule, 'id'>) => void;
  updateCruiseSchedule: (id: string, departureTime: string) => void;
  cancelCruiseSchedule: (id: string) => void;
  addCruiseReservation: (reservation: Omit<CruiseReservation, 'id'>) => void;
  getCruiseAvailableSeats: (scheduleId: string) => { total: number; reserved: number; available: number };

  addGuideSchedule: (schedule: Omit<GuideSchedule, 'id'>) => void;
  updateGuideStatus: (id: string, status: Guide['status']) => void;
  deleteGuideSchedule: (id: string) => void;
  assignGuideToBooking: (bookingId: string, guideId: string, scheduleId: string) => void;

  createWorkOrder: (order: Omit<WorkOrder, 'id' | 'createdAt'>) => void;
  assignWorkOrder: (id: string, assigneeId: string, assigneeName: string) => void;
  completeWorkOrder: (id: string) => void;

  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void;
  assignComplaint: (id: string, assigneeId: string, assigneeName: string) => void;
  resolveComplaint: (id: string) => void;
  addLostItem: (item: Omit<LostItem, 'id' | 'createdAt'>) => void;
  claimLostItem: (id: string) => void;
  addBroadcast: (broadcast: Omit<Broadcast, 'id'>) => void;

  addRecentlyProcessed: (item: Omit<RecentlyProcessed, 'id' | 'timestamp'>) => void;
  clearRecentlyProcessed: () => void;

  exportDailyReport: () => void;
  switchRole: (role: User['role']) => void;
  switchArea: (area: string) => void;
  getFilteredFlowData: () => FlowData[];
  getFilteredComplaints: () => Complaint[];
  getFilteredWorkOrders: () => WorkOrder[];
  getFilteredBookings: () => BookingWithServices[];
  getPendingDispatchList: () => BookingWithServices[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>((set, get) => ({
  user: initialCurrentUser,
  userArea: 'all',
  bookings: initialBookings as BookingWithServices[],
  cruises: initialCruises,
  cruiseSchedules: initialCruiseSchedules,
  cruiseReservations: [],
  guides: initialGuides,
  guideSchedules: initialGuideSchedules,
  workOrders: initialWorkOrders,
  inspections: initialInspections,
  complaints: initialComplaints,
  lostItems: initialLostItems,
  broadcasts: initialBroadcasts,
  merchants: initialMerchants,
  satisfactionData: initialSatisfactionData,
  dailyReports: initialDailyReports,
  warnings: initialWarnings,
  flowData: initialFlowData,
  recentlyProcessed: [],

  verifyBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'verified' as const } : b),
  })),

  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
  })),

  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, { ...booking, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  updateBookingServices: (id, services) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, ...services } : b),
  })),

  rescheduleReservations: (scheduleId) => set((state) => ({
    cruiseReservations: state.cruiseReservations.map(r => 
      r.scheduleId === scheduleId ? { ...r, status: 'pending_reschedule' as const } : r
    ),
  })),

  addCruiseSchedule: (schedule) => set((state) => ({
    cruiseSchedules: [...state.cruiseSchedules, { ...schedule, id: generateId() }],
  })),

  updateCruiseSchedule: (id, departureTime) => set((state) => ({
    cruiseSchedules: state.cruiseSchedules.map(s => s.id === id ? { ...s, departureTime } : s),
  })),

  cancelCruiseSchedule: (id) => set((state) => {
    const schedule = state.cruiseSchedules.find(s => s.id === id);
    const newReservations = schedule 
      ? state.cruiseReservations.map(r => 
          r.scheduleId === id ? { ...r, status: 'pending_reschedule' as const } : r
        )
      : state.cruiseReservations;
    return {
      cruiseSchedules: state.cruiseSchedules.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s),
      cruiseReservations: newReservations,
    };
  }),

  addCruiseReservation: (reservation) => set((state) => ({
    cruiseReservations: [...state.cruiseReservations, { ...reservation, id: generateId() }],
  })),

  getCruiseAvailableSeats: (scheduleId) => {
    const state = get();
    const schedule = state.cruiseSchedules.find(s => s.id === scheduleId);
    const cruise = schedule ? state.cruises.find(c => c.id === schedule.cruiseId) : null;
    const total = cruise?.capacity || 0;
    const reserved = state.cruiseReservations
      .filter(r => r.scheduleId === scheduleId && r.status === 'confirmed')
      .reduce((sum, r) => sum + r.passengerCount, 0);
    return { total, reserved, available: total - reserved };
  },

  addGuideSchedule: (schedule) => set((state) => ({
    guideSchedules: [...state.guideSchedules, { ...schedule, id: generateId() }],
  })),

  updateGuideStatus: (id, status) => set((state) => ({
    guides: state.guides.map(g => g.id === id ? { ...g, status } : g),
  })),

  deleteGuideSchedule: (id) => set((state) => ({
    guideSchedules: state.guideSchedules.filter(s => s.id !== id),
  })),

  assignGuideToBooking: (bookingId, guideId, scheduleId) => set((state) => ({
    bookings: state.bookings.map(b => 
      b.id === bookingId ? { ...b, hasGuideService: true, guideScheduleId: scheduleId } : b
    ),
  })),

  createWorkOrder: (order) => set((state) => ({
    workOrders: [...state.workOrders, { ...order, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  assignWorkOrder: (id, assigneeId, assigneeName) => set((state) => ({
    workOrders: state.workOrders.map(w => w.id === id ? { ...w, assigneeId, assigneeName, status: 'processing' as const } : w),
  })),

  completeWorkOrder: (id) => {
    const state = get();
    const workOrder = state.workOrders.find(w => w.id === id);
    if (workOrder) {
      get().addRecentlyProcessed({
        type: 'workorder',
        content: `${workOrder.type === 'cleaning' ? '清洁' : workOrder.type === 'inspection' ? '巡检' : '维修'}工单 - ${workOrder.location}`,
        action: '完成',
      });
    }
    set((state) => ({
      workOrders: state.workOrders.map(w => w.id === id ? { ...w, status: 'completed' as const } : w),
    }));
  },

  addComplaint: (complaint) => set((state) => ({
    complaints: [...state.complaints, { ...complaint, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  assignComplaint: (id, assigneeId, assigneeName) => {
    const state = get();
    const complaint = state.complaints.find(c => c.id === id);
    if (complaint) {
      get().addRecentlyProcessed({
        type: 'complaint',
        content: `投诉 - ${complaint.content.substring(0, 20)}...`,
        action: '分派给' + assigneeName,
      });
    }
    set((state) => ({
      complaints: state.complaints.map(c => c.id === id ? { ...c, assigneeId, assigneeName, status: 'assigned' as const } : c),
    }));
  },

  resolveComplaint: (id) => {
    const state = get();
    const complaint = state.complaints.find(c => c.id === id);
    if (complaint) {
      get().addRecentlyProcessed({
        type: 'complaint',
        content: `投诉 - ${complaint.content.substring(0, 20)}...`,
        action: '已解决',
      });
    }
    set((state) => ({
      complaints: state.complaints.map(c => c.id === id ? { ...c, status: 'resolved' as const } : c),
    }));
  },

  addLostItem: (item) => set((state) => ({
    lostItems: [...state.lostItems, { ...item, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  claimLostItem: (id) => {
    const state = get();
    const item = state.lostItems.find(l => l.id === id);
    if (item) {
      get().addRecentlyProcessed({
        type: 'lostitem',
        content: `遗失物品 - ${item.name}`,
        action: '已认领',
      });
    }
    set((state) => ({
      lostItems: state.lostItems.map(l => l.id === id ? { ...l, status: 'claimed' as const } : l),
    }));
  },

  addBroadcast: (broadcast) => {
    get().addRecentlyProcessed({
      type: 'broadcast',
      content: `广播 - ${broadcast.content.substring(0, 20)}...`,
      action: '已发布',
    });
    set((state) => ({
      broadcasts: [...state.broadcasts, { ...broadcast, id: generateId() }],
    }));
  },

  addRecentlyProcessed: (item) => set((state) => ({
    recentlyProcessed: [
      { ...item, id: generateId(), timestamp: new Date().toLocaleString() },
      ...state.recentlyProcessed.slice(0, 9),
    ],
  })),

  clearRecentlyProcessed: () => set({ recentlyProcessed: [] }),

  exportDailyReport: () => {
    const state = get();
    const isAreaAdmin = state.user.role === 'area_admin';
    const areaName = state.userArea === 'all' ? '全景区' : state.userArea;
    
    const filteredFlowData = isAreaAdmin && state.userArea !== 'all' 
      ? state.flowData.filter(f => f.areaName === state.userArea)
      : state.flowData;
    const filteredComplaints = isAreaAdmin && state.userArea !== 'all'
      ? state.complaints
      : state.complaints;
    const filteredWorkOrders = isAreaAdmin && state.userArea !== 'all'
      ? state.workOrders
      : state.workOrders;

    const totalVisitors = filteredFlowData.reduce((sum, f) => sum + f.visitorCount, 0);
    
    const report = {
      date: new Date().toLocaleDateString('zh-CN'),
      area: areaName,
      role: isAreaAdmin ? '片区管理员' : '运营中心',
      summary: {
        totalVisitors,
        bookings: state.bookings.filter(b => b.visitDate === new Date().toISOString().split('T')[0]).length,
        complaints: filteredComplaints.length,
        workOrdersCompleted: filteredWorkOrders.filter(w => w.status === 'completed').length,
        satisfaction: 4.7,
      },
      details: {
        flowData: filteredFlowData,
        complaints: filteredComplaints.slice(0, 10),
        workOrders: filteredWorkOrders.slice(0, 10),
      },
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_report_${areaName}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  switchRole: (role) => set((state) => ({
    user: { ...state.user, role, department: role === 'admin' ? '运营中心' : '片区管理' },
    userArea: role === 'admin' ? 'all' : state.userArea,
  })),

  switchArea: (area) => set({ userArea: area }),

  getFilteredFlowData: () => {
    const state = get();
    if (state.user.role === 'admin' || state.userArea === 'all') {
      return state.flowData;
    }
    return state.flowData.filter(f => f.areaName === state.userArea);
  },

  getFilteredComplaints: () => {
    const state = get();
    if (state.user.role === 'admin' || state.userArea === 'all') {
      return state.complaints;
    }
    return state.complaints;
  },

  getFilteredWorkOrders: () => {
    const state = get();
    if (state.user.role === 'admin' || state.userArea === 'all') {
      return state.workOrders;
    }
    return state.workOrders;
  },

  getFilteredBookings: () => {
    const state = get();
    if (state.user.role === 'admin' || state.userArea === 'all') {
      return state.bookings;
    }
    return state.bookings;
  },

  getPendingDispatchList: () => {
    const state = get();
    return state.bookings.filter(b => 
      b.status === 'pending' && 
      (b.hasGuideService || b.hasCruiseService) &&
      (!b.guideScheduleId || !b.cruiseScheduleId)
    );
  },
}));