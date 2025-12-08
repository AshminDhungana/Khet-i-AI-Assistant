export interface ImageAnalysisResult {
  timestamp: string;
  imageUrl: string;
  healthScore: number;
  cropType: string;
  diseaseDetected: boolean;
  recommendations: string[];
  confidenceLevel: number;
  analysisText: string;
}

export interface PredictionResult {
  biomass: { value: number; min: number; max: number }; // kg/ha
  yield: { value: number; unit: string }; // tonnes/ha
  carbonSequest: number; // tonnes CO2/ha
  daysToHarvest: number;
  factors: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FarmLocation {
  lat: number;
  lng: number;
  area: number; // hectares
  name: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ANALYZE = 'ANALYZE',
  PREDICT = 'PREDICT',
  CHAT = 'CHAT',
  MAP = 'MAP',
}

export interface VoiceNote {
  id: string;
  text: string;
  date: Date;
  actionItems: string[];
}
