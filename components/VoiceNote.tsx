import React, { useState, useEffect } from 'react';
import { MicIcon, CheckCircle } from './Icons';
import { VoiceNote as VoiceNoteType } from '../types';

interface VoiceNoteProps {
  onNoteCreate: (note: VoiceNoteType) => void;
}

const VoiceNote: React.FC<VoiceNoteProps> = ({ onNoteCreate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and process
      setIsRecording(false);
      setProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        const mockNote: VoiceNoteType = {
          id: Date.now().toString(),
          date: new Date(),
          text: "Observed yellowing leaves on the south paddy field. Soil feels dry despite irrigation yesterday.",
          actionItems: ["Check irrigation channels", "Monitor for Nitrogen deficiency"]
        };
        onNoteCreate(mockNote);
        setProcessing(false);
      }, 2000);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 md:right-8 md:bottom-8">
      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center animate-fade-in shadow-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center relative z-10">
                 <MicIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-800">Listening...</h3>
            <p className="text-gray-500 mt-2">Describe your observation</p>
            <div className="mt-4 font-mono text-2xl font-bold text-red-500">
              00:{recordingTime.toString().padStart(2, '0')}
            </div>
            <button 
              onClick={toggleRecording}
              className="mt-8 bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition"
            >
              Stop Recording
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={toggleRecording}
        disabled={processing}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-105 active:scale-95 ${
          processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
        }`}
        title="Record Voice Note"
      >
        {processing ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <MicIcon className="text-white w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default VoiceNote;