
import React, { useState } from 'react';
import { AppProvider } from './store';
import { SettingsProvider } from './themeStore';
import { SchoolProvider } from './schoolStore';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import SessionList from './components/SessionList';
import AppointmentsSchedule from './components/AppointmentsSchedule';
import SchoolSchedule from './components/SchoolSchedule';
import FinanceReport from './components/FinanceReport';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'sessions' | 'appointments' | 'school' | 'finance' | 'settings'>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'students': return <StudentList />;
      case 'sessions': return <SessionList />;
      case 'appointments': return <AppointmentsSchedule />;
      case 'school': return <SchoolSchedule />;
      case 'finance': return <FinanceReport />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <SettingsProvider>
      <SchoolProvider>
        <AppProvider>
          <div className="min-h-screen pb-24 bg-[#020617] dark:bg-[#020617] light:bg-white">
            <Header />
            <main className="max-w-md mx-auto px-4 pt-4">
              {renderContent()}
            </main>
            <BottomNav activeTab={activeTab as any} setActiveTab={setActiveTab as any} />
          </div>
        </AppProvider>
      </SchoolProvider>
    </SettingsProvider>
  );
};

export default App;
