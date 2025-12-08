import React from 'react';
import { ImageAnalysisResult, AppView } from '../types';
import { LeafIcon, AlertTriangle, CheckCircle, ChartIcon } from './Icons';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  recentAnalyses: ImageAnalysisResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, recentAnalyses }) => {
  return (
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 animate-fade-in">
      {/* Header Summary */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-8 flex flex-col justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Farm Status</h2>
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center justify-center text-center">
            <CheckCircle className="text-green-500 mb-2 h-8 w-8" />
            <span className="text-sm text-gray-600">Active Crops</span>
            <span className="text-xl font-bold text-gray-900">Rice, Wheat</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="text-amber-500 mb-2 h-8 w-8" />
            <span className="text-sm text-gray-600">Alerts</span>
            <span className="text-xl font-bold text-gray-900">2 Warnings</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="md:col-span-4 flex flex-col gap-4">
        <button 
          onClick={() => onNavigate(AppView.ANALYZE)}
          className="bg-blue-600 text-white p-4 rounded-xl shadow-md active:bg-blue-700 hover:bg-blue-700 transition flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 flex-1 min-h-[100px]"
        >
          <LeafIcon className="h-8 w-8" />
          <span className="font-semibold">Analyze Crop</span>
        </button>
        <button 
          onClick={() => onNavigate(AppView.PREDICT)}
          className="bg-emerald-600 text-white p-4 rounded-xl shadow-md active:bg-emerald-700 hover:bg-emerald-700 transition flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 flex-1 min-h-[100px]"
        >
          <ChartIcon className="h-8 w-8" />
          <span className="font-semibold">Predict Yield</span>
        </button>
      </section>

      {/* Recent History */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        
        {recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <LeafIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No recent analysis. Start by uploading a photo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAnalyses.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition bg-gray-50 md:bg-white md:border-gray-100">
                <img src={item.imageUrl} alt="Crop" className="w-16 h-16 object-cover rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.cropType}</h4>
                  <div className="flex items-center text-sm gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.healthScore > 80 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      Health: {item.healthScore}%
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;