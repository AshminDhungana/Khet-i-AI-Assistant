# Khet-i AI Assistant 🌾

**Empowering Smallholder Farmers with Multimodal AI**

Khet-i (derived from 'Kheti', meaning *farming* in Nepali/Hindi) is an enterprise-grade agricultural intelligence platform designed specifically for smallholder farmers and agricultural researchers in developing regions, with a primary focus on Nepal and India.

In these regions, access to professional agronomy advice is often limited, expensive, or delayed. Khet-i bridges this gap by leveraging **Google's Gemini 2.5 and 3.0 Pro models** to provide instant, expert-level crop diagnosis, yield forecasting, and personalized advisory services directly through a smartphone or desktop browser.

## 🚀 Mission

To democratize access to precision agriculture technology, enabling farmers to:
- **Reduce crop loss** through early disease detection.
- **Optimize inputs** (fertilizer, water) via data-driven predictions.
- **Bridge the literacy gap** using voice and visual interfaces.

---

## ✨ Key Features

### 1. 🔍 Multimodal Crop Diagnosis
Upload photos from any source—smartphone cameras, drones, or satellite imagery. The app uses **Gemini Vision** to:
- Identify crop types and growth stages.
- Detect specific pathogens (rust, blight, mildew) and nutrient deficiencies.
- Generate a health score (0-100%) and actionable treatment plans.
- *Visualizes the AI's "thought process" via an agentic workflow simulation.*

### 2. 💬 AI Agronomist Chat
A context-aware chat interface powered by **Gemini 3 Pro**. Farmers can ask questions in natural language (e.g., *"Why are my rice leaves turning yellow?"*) and receive localized, scientific advice. It supports context retention for follow-up questions.

### 3. 📈 Biomass & Yield Prediction
An interactive forecasting tool that estimates harvest yields and biomass based on:
- Crop type and soil conditions.
- Moisture levels and field area.
- *Visualizes growth trajectories against regional averages using interactive charts.*

### 4. 🎙️ Voice Note Intelligence
Recognizing that typing can be a barrier in the field, this feature allows farmers to record observations verbally. The system simulates transcribing the audio and extracting structured action items (e.g., *"Buy Sulphur fungicide"*).

### 5. 🗺️ Satellite & Location Intelligence
An interactive map interface allowing farmers to pin their location and define field boundaries. (Designed as an integration point for Google Earth Engine data).

---

## 🛠️ Technical Architecture

This project is a **Single-Page Application (SPA)** built for performance and resilience in low-bandwidth environments.

- **Frontend**: React 19 + TypeScript (Functional components, Hooks).
- **Styling**: Tailwind CSS (Utility-first, responsive design).
- **AI Integration**: Google GenAI SDK (`@google/genai`) connecting to Gemini 2.5 Flash and Gemini 3 Pro.
- **Visualization**: Recharts for data visualization.
- **State Management**: React Context & Hooks (No external state libraries to keep bundle size low).
- **Deployment**: Vite-compatible structure, ready for Google Cloud Run.

## ⚙️ Setup & Configuration

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API access.

### API Key
This application requires a Google Gemini API key.
1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. The app looks for `process.env.API_KEY`.
   - **Local Dev**: Create a `.env` file: `API_KEY=your_key_here`.
   - **Production**: Set the environment variable in your build pipeline.

### Installation
```bash
# Clone the repository
git clone https://github.com/AshminDhungana/khet-i.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## ⚠️ Demo Mode & Fallbacks

The application is designed with robust error handling:
- **Missing API Key**: If no key is provided, the app automatically switches to **Demo Mode**, returning simulated, high-fidelity mock data for all features. This allows for UI/UX testing without incurring API costs.
- **Network Errors**: Graceful error messages and retry prompts ensure the user is never left staring at a blank screen.

---

*Built with ❤️ for the farmers of the Himalayas and the Gangetic Plains.*
