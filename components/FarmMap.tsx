import React, { useState } from 'react';
import { MapIcon } from './Icons';

const FarmMap: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);

  // Since we cannot rely on a valid API Key for Google Maps in this generated demo, 
  // we will build a high-fidelity mock UI that simulates the experience.
  
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-2 rounded-lg shadow-md text-xs font-mono">
          <p>LAT: 28.3949 N</p>
          <p>LNG: 84.1240 E</p>
          <p className="text-green-600 mt-1 font-bold">Region: Pokhara, Nepal</p>
        </div>

        {/* Mock Map View */}
        <div className="flex-1 bg-gray-200 rounded-lg relative overflow-hidden group">
          {/* Simulated Satellite Image Background */}
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover bg-center mix-blend-overlay"></div>
             {/* Grid overlay */}
             <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
            
            {/* Field Boundary Simulation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon points="120,150 250,120 300,280 100,320" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 pointer-events-none select-none">
              <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <span>Interactive Map Placeholder</span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button 
              className={`p-3 rounded-full shadow-lg transition ${isDrawing ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setIsDrawing(!isDrawing)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.174 6.812-3.969-3.969a2.43 2.43 0 0 0-3.414 0L5 11.606V19h7.394l8.78-8.775a2.43 2.43 0 0 0 0-3.419Z"/>
                <line x1="10" x2="20" y1="13" y2="23"/>
              </svg>
            </button>
            <button className="bg-white p-3 rounded-full shadow-lg text-gray-700">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          <strong>Note:</strong> Google Earth Engine integration requires an active API key. Currently showing cached regional data.
        </div>
      </div>
    </div>
  );
};

export default FarmMap;
