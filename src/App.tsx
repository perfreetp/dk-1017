import { useState } from 'react';
import { Sidebar, Header } from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookingManagement from './pages/BookingManagement';
import CruiseManagement from './pages/CruiseManagement';
import GuideManagement from './pages/GuideManagement';
import CleaningWorkOrder from './pages/CleaningWorkOrder';
import FeedbackManagement from './pages/FeedbackManagement';
import ReportsCenter from './pages/ReportsCenter';

const pages: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  booking: BookingManagement,
  cruise: CruiseManagement,
  guide: GuideManagement,
  cleaning: CleaningWorkOrder,
  feedback: FeedbackManagement,
  reports: ReportsCenter,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const CurrentPage = pages[currentPage];

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          <CurrentPage />
        </main>
      </div>
    </div>
  );
}