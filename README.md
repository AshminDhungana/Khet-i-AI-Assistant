# Khet-i AI Assistant

An enterprise-grade agricultural AI assistant designed for smallholder farmers in developing regions (Nepal, India focus). Built with React, TypeScript, Tailwind CSS, and Google Gemini APIs.

## Features

- **Multimodal Image Analysis**: Upload crop photos (drone/satellite/phone) for real-time health assessment and disease detection using Gemini Vision.
- **Agricultural Chatbot**: Expert advice powered by `gemini-3-pro-preview` with context-aware responses.
- **Biomass & Yield Prediction**: Interactive calculators with visualization for yield estimation.
- **Satellite Intelligence**: Integration-ready map interface for field boundary analysis.
- **Voice Note Capture**: Record farm observations with simulated transcription and action item extraction.
- **Farm Dashboard**: Centralized view of farm health status, alerts, and history.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI/ML**: Google Gemini API (`@google/genai` SDK)
- **Charts**: Recharts
- **Build**: Vite-compatible structure (runs in Google AI Studio)

## Setup & Configuration

### API Keys
This application requires a Google Gemini API key to function fully.

1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. The application expects the API key to be available in `process.env.API_KEY`.
   - In Google AI Studio: The environment handles this automatically.
   - For local development: Create a `.env` file and add `API_KEY=your_key_here`.

### Running Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## Usage Notes

- **Demo Mode**: If no API key is detected, the app gracefully falls back to simulated data for demonstration purposes (Mock Analysis, Mock Chat).
- **Offline First**: The UI is designed to be responsive and lightweight for low-bandwidth agricultural environments.
