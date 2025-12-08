import React, { useState, useRef } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { ImageAnalysisResult } from '../types';
import { UploadIcon, AlertTriangle, CheckCircle, LeafIcon } from './Icons';

interface ImageAnalyzerProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setSteps([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAgenticSimulation = async () => {
    const sequence = [
      "Identifying crop type...",
      "Analysing vegetation patterns (NDVI approximation)...",
      "Scanning for pathogen markers...",
      "Checking local weather conditions...",
      "Formulating recommendations..."
    ];

    for (const step of sequence) {
      setSteps(prev => [...prev, step]);
      await new Promise(r => setTimeout(r, 800)); // Delay for effect
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setSteps([]);
    setResult(null);

    // Run visual simulation concurrently with actual API call
    const simPromise = runAgenticSimulation();
    
    // Clean base64 string
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    try {
      const [apiResult] = await Promise.all([
        analyzeCropImage(base64Data, mimeType),
        simPromise
      ]);
      setResult(apiResult);
      onAnalysisComplete(apiResult);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-xl p-8 cursor-pointer hover:bg-blue-50 transition"
          >
            <UploadIcon className="mx-auto h-12 w-12 text-blue-400 mb-3" />
            <p className="text-gray-600 font-medium">Tap to upload Photo</p>
            <p className="text-gray-400 text-sm mt-2">Satellite, Drone, or Crop close-up</p>
          </div>
        ) : (
          <div className="relative">
            <img src={image} alt="Preview" className="w-full max-h-64 object-cover rounded-lg shadow-sm" />
            {!isAnalyzing && !result && (
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-gray-900/50 text-white p-1 rounded-full hover:bg-gray-900/70"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {image && !isAnalyzing && !result && (
          <button 
            onClick={handleAnalyze}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition"
          >
            Start Gemini Analysis
          </button>
        )}
      </div>

      {/* Agentic Workflow Visualization */}
      {isAnalyzing && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Gemini Workflow</h3>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 animate-fade-in">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className={`p-4 ${result.healthScore > 80 ? 'bg-green-600' : 'bg-amber-500'} text-white`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{result.cropType}</h2>
              <span className="text-2xl font-bold">{result.healthScore}% Health</span>
            </div>
            <p className="opacity-90 mt-1 text-sm">{result.diseaseDetected ? "Issues Detected" : "Crop Healthy"}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-gray-500" /> Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">{result.analysisText}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-blue-800 text-sm">
                    <span className="font-bold">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-right text-xs text-gray-400">
              Confidence: {result.confidenceLevel}% • AI Generated
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
