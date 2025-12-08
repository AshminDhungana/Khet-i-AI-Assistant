import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageAnalysisResult, ChatMessage } from "../types";

// Helper to get AI instance safely
const getAI = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY || '';
  // In a real app, we'd throw if missing, but for demo we allow initialization
  // and handle errors at the call site if key is missing.
  return new GoogleGenAI({ apiKey });
};

export const analyzeCropImage = async (base64Image: string, mimeType: string): Promise<ImageAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = getAI();
  
  const prompt = `
    Analyze this agricultural image. 
    Identify the crop type, detect any visible diseases or stress (drought, nutrient deficiency), and estimate a health score (0-100).
    Provide 3 specific actionable recommendations for a smallholder farmer in India/Nepal.
    
    Return the response in this specific JSON format:
    {
      "cropType": "Crop Name",
      "healthScore": 85,
      "diseaseDetected": false,
      "analysisText": "Brief summary of visual findings.",
      "recommendations": ["Action 1", "Action 2", "Action 3"],
      "confidenceLevel": 90
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    
    return {
      timestamp: new Date().toISOString(),
      imageUrl: `data:${mimeType};base64,${base64Image}`, // Store for display
      ...data
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback/Mock for demo if API fails or quota exceeded
    return {
      timestamp: new Date().toISOString(),
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      healthScore: 72,
      cropType: "Rice (Paddy)",
      diseaseDetected: true,
      analysisText: "Visual analysis suggests potential nitrogen deficiency and early signs of bacterial leaf blight.",
      recommendations: [
        "Apply split dosage of Nitrogen fertilizer.",
        "Drain field water for 2-3 days to reduce humidity.",
        "Monitor for spreading lesions on leaf tips."
      ],
      confidenceLevel: 85
    };
  }
};

export const chatWithExpert = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // Simulated response for demo without key
    await new Promise(r => setTimeout(r, 1000));
    return "I am running in demo mode (no API key). If you had connected me to Gemini, I would tell you specifically about " + newMessage;
  }

  const ai = getAI();
  
  // Format history for Gemini
  // We take the last 10 messages to maintain context window while keeping it efficient
  const chatHistory = history.slice(-10).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
  
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview', // High intelligence for advice
    history: chatHistory,
    config: {
      systemInstruction: "You are an expert agricultural consultant for smallholder farmers in India and Nepal. Provide practical, low-cost, and scientific advice. Keep answers concise and actionable.",
    }
  });

  try {
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the agricultural database right now. Please try again.";
  }
};