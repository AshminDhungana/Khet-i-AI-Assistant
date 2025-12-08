import React, { useState } from 'react';
import { AppView, ImageAnalysisResult, VoiceNote as VoiceNoteType, User } from './types';
import Dashboard from './components/Dashboard';
import ImageAnalyzer from './components/ImageAnalyzer';
import PredictionTools from './components/PredictionTools';
import AgriChat from './components/AgriChat';
import FarmMap from './components/FarmMap';
import VoiceNote from './components/VoiceNote';
import AuthScreen from './components/AuthScreen';
import { LeafIcon, MapIcon, ChartIcon, SendIcon, CheckCircle } from './components/Icons';

// Mock Data for Initial State
const MOCK_HISTORY: ImageAnalysisResult[] = [
  {
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    imageUrl: 'https://picsum.photos/id/400/200/200',
    healthScore: 78,
    cropType: 'Wheat',
    diseaseDetected: false,
    recommendations: ['Monitor moisture'],
    confidenceLevel: 88,
    analysisText: 'Looking good.'
  },
  {
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    imageUrl: 'https://picsum.photos/id/500/200/200',
    healthScore: 45,
    cropType: 'Maize',
    diseaseDetected: true,
    recommendations: ['Apply Fungicide'],
    confidenceLevel: 92,
    analysisText: 'Rust detected.'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [history, setHistory] = useState<ImageAnalysisResult[]>(MOCK_HISTORY);
  const [toast, setToast] = useState<string | null>(null);

  const handleAnalysisComplete = (result: ImageAnalysisResult) => {
    setHistory(prev => [result, ...prev]);
    showToast("Analysis saved to history");
  };

  const handleVoiceNote = (note: VoiceNoteType) => {
    showToast("Voice note transcribed & saved");
    // In a real app, save this to state/db
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.DASHBOARD);
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const NavItem = ({ target, icon: Icon, label, active }: { target: AppView, icon: any, label: string, active: boolean }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center gap-1 p-2 flex-1 md:flex-none md:flex-row md:gap-3 md:w-full md:px-4 md:py-3 md:rounded-xl transition ${
        active 
          ? 'text-blue-600 md:bg-blue-50' 
          : 'text-gray-400 hover:text-gray-600 md:text-gray-600 md:hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : ''}`} />
      <span className="text-[10px] font-medium md:text-sm md:font-semibold">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setView} recentAnalyses={history} />;
      case AppView.ANALYZE:
        return <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />;
      case AppView.PREDICT:
        return <PredictionTools />;
      case AppView.CHAT:
        return <AgriChat />;
      case AppView.MAP:
        return <FarmMap />;
      default:
        return <Dashboard onNavigate={setView} recentAnalyses={history} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded-lg">
              <LeafIcon className="text-white h-6 w-6" />
           </div>
           <h1 className="font-bold text-xl tracking-tight text-gray-900">Khet-i <span className="text-blue-600">AI</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem target={AppView.DASHBOARD} icon={LeafIcon} label="Dashboard" active={view === AppView.DASHBOARD} />
          <NavItem target={AppView.ANALYZE} icon={CheckCircle} label="Analyze Crop" active={view === AppView.ANALYZE} />
          <NavItem target={AppView.MAP} icon={MapIcon} label="Farm Map" active={view === AppView.MAP} />
          <NavItem target={AppView.PREDICT} icon={ChartIcon} label="Yield Predictor" active={view === AppView.PREDICT} />
          <NavItem target={AppView.CHAT} icon={SendIcon} label="Ask Expert" active={view === AppView.CHAT} />
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition group relative">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
               {user.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
               ) : (
                 user.name.charAt(0)
               )}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
               <p className="text-xs text-gray-500 truncate">{user.farmName || 'Smallholder'}</p>
             </div>
             
             {/* Hover Logout Button */}
             <button 
                onClick={handleLogout}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-50 text-red-600 p-1.5 rounded-lg transition"
                title="Logout"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
             </button>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
             <LeafIcon className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-900">Khet-i <span className="text-blue-600">AI</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
            {user.avatarUrl ? (
               <img src={user.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
             ) : (
               user.name.charAt(0)
             )}
          </div>
          <button onClick={handleLogout} className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-[calc(100vh-60px)] md:h-screen bg-gray-50">
        <div className="p-4 md:p-8 max-w-lg md:max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {renderContent()}
        </div>
      </main>

      {/* Floating Action / Voice Note */}
      {view !== AppView.CHAT && (
        <VoiceNote onNoteCreate={handleVoiceNote} />
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-2 py-1">
          <NavItem target={AppView.DASHBOARD} icon={LeafIcon} label="Home" active={view === AppView.DASHBOARD} />
          <NavItem target={AppView.ANALYZE} icon={CheckCircle} label="Analyze" active={view === AppView.ANALYZE} />
          <NavItem target={AppView.MAP} icon={MapIcon} label="Map" active={view === AppView.MAP} />
          <NavItem target={AppView.PREDICT} icon={ChartIcon} label="Predict" active={view === AppView.PREDICT} />
          <NavItem target={AppView.CHAT} icon={SendIcon} label="Ask" active={view === AppView.CHAT} />
        </div>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;