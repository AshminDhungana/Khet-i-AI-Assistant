import React, { useState } from 'react';
import { AppView, ImageAnalysisResult, VoiceNote as VoiceNoteType } from './types';
import Dashboard from './components/Dashboard';
import ImageAnalyzer from './components/ImageAnalyzer';
import PredictionTools from './components/PredictionTools';
import AgriChat from './components/AgriChat';
import FarmMap from './components/FarmMap';
import VoiceNote from './components/VoiceNote';
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

  const NavItem = ({ target, icon: Icon, label }: { target: AppView, icon: any, label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center gap-1 p-2 flex-1 transition ${
        view === target ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon className={`w-6 h-6 ${view === target ? 'stroke-[2.5px]' : ''}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
             <LeafIcon className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-900">Khet-i <span className="text-blue-600">AI</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
           <img src="https://picsum.photos/seed/farmer/200/200" alt="Profile" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto w-full">
        {renderContent()}
      </main>

      {/* Floating Action / Voice Note */}
      {view !== AppView.CHAT && (
        <VoiceNote onNoteCreate={handleVoiceNote} />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 max-w-lg mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-2 py-1">
          <NavItem target={AppView.DASHBOARD} icon={LeafIcon} label="Home" />
          <NavItem target={AppView.ANALYZE} icon={CheckCircle} label="Analyze" />
          <NavItem target={AppView.MAP} icon={MapIcon} label="Map" />
          <NavItem target={AppView.PREDICT} icon={ChartIcon} label="Predict" />
          <NavItem target={AppView.CHAT} icon={SendIcon} label="Ask Expert" />
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
