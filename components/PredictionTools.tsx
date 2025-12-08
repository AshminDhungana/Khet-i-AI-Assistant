import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartIcon } from './Icons';

const PredictionTools: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'Rice',
    area: 1,
    soil: 'Clay',
    moisture: 50,
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate complex calculation delay
    await new Promise(r => setTimeout(r, 1500));

    // Mock logic based on inputs
    const baseYield = formData.crop === 'Rice' ? 4.5 : 3.2;
    const soilFactor = formData.soil === 'Clay' ? 1.1 : 0.9;
    const area = Number(formData.area);
    
    const finalYield = baseYield * soilFactor * (formData.moisture / 60);

    setResult({
      biomass: { value: finalYield * 2.2 * 1000, min: 8000, max: 12000 },
      yield: { value: parseFloat(finalYield.toFixed(2)), unit: 'tonnes/ha' },
      carbonSequest: parseFloat((finalYield * 0.4).toFixed(2)),
      daysToHarvest: 45,
      factors: ['Good soil moisture', 'Optimal planting window']
    });
    setLoading(false);
  };

  const chartData = result ? [
    { name: 'Your Farm', yield: result.yield.value },
    { name: 'Regional Avg', yield: 3.8 },
    { name: 'Top 10%', yield: 5.2 },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <ChartIcon className="text-blue-600" /> Yield Predictor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.crop}
                onChange={(e) => setFormData({...formData, crop: e.target.value})}
              >
                <option>Rice</option>
                <option>Wheat</option>
                <option>Maize</option>
                <option>Soybean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (Ha)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
            <select 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.soil}
              onChange={(e) => setFormData({...formData, soil: e.target.value})}
            >
              <option>Clay</option>
              <option>Loam</option>
              <option>Sandy</option>
              <option>Black Soil</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Moisture Level</label>
              <span className="text-xs text-blue-600 font-bold">{formData.moisture}%</span>
            </div>
            <input 
              type="range" 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={formData.moisture}
              onChange={(e) => setFormData({...formData, moisture: Number(e.target.value)})}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Dry</span>
              <span>Flooded</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-pulse">Calculating...</span>
            ) : "Run Prediction Model"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
              <span className="text-gray-500 text-xs uppercase font-bold">Est. Yield</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{result.yield.value}</div>
              <span className="text-xs text-emerald-600 font-medium">{result.yield.unit}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
              <span className="text-gray-500 text-xs uppercase font-bold">Biomass</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{(result.biomass.value/1000).toFixed(1)}k</div>
              <span className="text-xs text-blue-600 font-medium">kg/ha</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-gray-500 text-xs uppercase font-bold">Carbon</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{result.carbonSequest}</div>
              <span className="text-xs text-gray-600 font-medium">tons CO2/ha</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
              <span className="text-gray-500 text-xs uppercase font-bold">Harvest In</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{result.daysToHarvest}</div>
              <span className="text-xs text-amber-600 font-medium">Days</span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-6">Yield Comparison (Tonnes/Ha)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Bar dataKey="yield" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionTools;
