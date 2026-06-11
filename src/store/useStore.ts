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

interface AppState {
  user: User;
  bookings: Booking[];
  cruises: Cruise[];
  cruiseSchedules: CruiseSchedule[];
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

  // Booking actions
  verifyBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;

  // Cruise schedule actions
  addCruiseSchedule: (schedule: Omit<CruiseSchedule, 'id'>) => void;
  updateCruiseSchedule: (id: string, departureTime: string) => void;
  cancelCruiseSchedule: (id: string) => void;

  // Guide actions
  addGuideSchedule: (schedule: Omit<GuideSchedule, 'id'>) => void;
  updateGuideStatus: (id: string, status: Guide['status']) => void;
  deleteGuideSchedule: (id: string) => void;

  // Work order actions
  createWorkOrder: (order: Omit<WorkOrder, 'id' | 'createdAt'>) => void;
  assignWorkOrder: (id: string, assigneeId: string, assigneeName: string) => void;
  completeWorkOrder: (id: string) => void;

  // Feedback actions
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void;
  assignComplaint: (id: string, assigneeId: string, assigneeName: string) => void;
  resolveComplaint: (id: string) => void;
  addLostItem: (item: Omit<LostItem, 'id' | 'createdAt'>) => void;
  claimLostItem: (id: string) => void;
  addBroadcast: (broadcast: Omit<Broadcast, 'id'>) => void;

  // Export
  exportDailyReport: () => void;

  // Role switch
  switchRole: (role: User['role']) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>((set) => ({
  user: initialCurrentUser,
  bookings: initialBookings,
  cruises: initialCruises,
  cruiseSchedules: initialCruiseSchedules,
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

  verifyBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'verified' as const } : b),
  })),

  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
  })),

  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, { ...booking, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  addCruiseSchedule: (schedule) => set((state) => ({
    cruiseSchedules: [...state.cruiseSchedules, { ...schedule, id: generateId() }],
  })),

  updateCruiseSchedule: (id, departureTime) => set((state) => ({
    cruiseSchedules: state.cruiseSchedules.map(s => s.id === id ? { ...s, departureTime } : s),
  })),

  cancelCruiseSchedule: (id) => set((state) => ({
    cruiseSchedules: state.cruiseSchedules.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s),
  })),

  addGuideSchedule: (schedule) => set((state) => ({
    guideSchedules: [...state.guideSchedules, { ...schedule, id: generateId() }],
  })),

  updateGuideStatus: (id, status) => set((state) => ({
    guides: state.guides.map(g => g.id === id ? { ...g, status } : g),
  })),

  deleteGuideSchedule: (id) => set((state) => ({
    guideSchedules: state.guideSchedules.filter(s => s.id !== id),
  })),

  createWorkOrder: (order) => set((state) => ({
    workOrders: [...state.workOrders, { ...order, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  assignWorkOrder: (id, assigneeId, assigneeName) => set((state) => ({
    workOrders: state.workOrders.map(w => w.id === id ? { ...w, assigneeId, assigneeName, status: 'processing' as const } : w),
  })),

  completeWorkOrder: (id) => set((state) => ({
    workOrders: state.workOrders.map(w => w.id === id ? { ...w, status: 'completed' as const } : w),
  })),

  addComplaint: (complaint) => set((state) => ({
    complaints: [...state.complaints, { ...complaint, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  assignComplaint: (id, assigneeId, assigneeName) => set((state) => ({
    complaints: state.complaints.map(c => c.id === id ? { ...c, assigneeId, assigneeName, status: 'assigned' as const } : c),
  })),

  resolveComplaint: (id) => set((state) => ({
    complaints: state.complaints.map(c => c.id === id ? { ...c, status: 'resolved' as const } : c),
  })),

  addLostItem: (item) => set((state) => ({
    lostItems: [...state.lostItems, { ...item, id: generateId(), createdAt: new Date().toLocaleString() }],
  })),

  claimLostItem: (id) => set((state) => ({
    lostItems: state.lostItems.map(l => l.id === id ? { ...l, status: 'claimed' as const } : l),
  })),

  addBroadcast: (broadcast) => set((state) => ({
    broadcasts: [...state.broadcasts, { ...broadcast, id: generateId() }],
  })),

  exportDailyReport: () => {
    const report = {
      date: new Date().toLocaleDateString('zh-CN'),
      totalVisitors: 9850,
      bookings: 2650,
      complaints: 8,
      lostItems: 5,
      workOrdersCompleted: 32,
      satisfaction: 4.7,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  switchRole: (role) => set((state) => ({
    user: { ...state.user, role, department: role === 'admin' ? '运营中心' : '片区管理' },
  })),
}));