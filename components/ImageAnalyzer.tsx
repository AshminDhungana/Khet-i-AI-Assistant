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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 rounded-xl p-8 lg:p-12 cursor-pointer hover:bg-blue-50 transition"
            >
              <UploadIcon className="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-blue-400 mb-3" />
              <p className="text-gray-600 font-medium text-lg">Tap or Drop to upload Photo</p>
              <p className="text-gray-400 text-sm mt-2">Satellite, Drone, or Crop close-up</p>
            </div>
          ) : (
            <div className="relative group">
              <img src={image} alt="Preview" className="w-full max-h-[400px] object-cover rounded-lg shadow-sm" />
              {!isAnalyzing && !result && (
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900/70 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition hover:bg-blue-700"
            >
              Start Gemini Analysis
            </button>
          )}
        </div>

        {/* Agentic Workflow Visualization - Show here while analyzing */}
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
      </div>

      <div className="space-y-6">
        {/* Empty State on Desktop */}
        {!result && !isAnalyzing && (
          <div className="hidden lg:flex h-full items-center justify-center p-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="text-center">
              <LeafIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Analysis results will appear here</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in border border-gray-100">
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
    </div>
  );
};

export default ImageAnalyzer;