# RecoverAI - Your AI Recovery Companion

**RecoverAI** is a multi-modal, GenAI-powered recovery and prevention platform designed to support individuals navigating substance use disorders and their caregivers. Designed for ease of use under high cognitive load, it provides zero-typing interventions, hands-free emotional support, emergency scripts, and educational content.

RecoverAI was built to be a simple, lightweight, yet visually stunning and premium companion that judges can navigate easily.

---

## 🌟 Key Features

1. **🎤 Talk to AI (Recovery Assistant):**
   - **Zero Typing Voice Interface:** Tap the microphone to speak about cravings, trigger events, or emotional distress. It translates speech to text live.
   - **Multilingual Dialect Support:** Select your preferred locale (English, Hindi, Tamil, or Telugu) from the sidebar footer dropdown or mobile header selector. Speech-to-text recognition and text-to-speech synthesis adapt dynamically to match the selected dialect.
   - **Language-Aligned AI:** Appends strict language prompts instructing Groq Llama-3.3 to reply entirely in the user's selected language, while maintaining exact English structural tags for card parsing.
   - **Empathy Tuner:** Set your active mood (Anxious, Craving, Overwhelmed, Down, Calm) to adapt AI responses to your emotional state.

2. **🚨 Emergency Script Generator:**
   - One-tap tool that generates a highly direct, personal distress text/SMS for your trusted caregiver (e.g. Dad, sister).
   - Custom parameters: specify caregiver name, relationship, current feeling, and the immediate action needed.
   - One-click button to copy the script.
   - Bypasses key limitations: works immediately out of the box using smart template backups if no API key is present.

3. **📚 Educational Hub:**
   - Quick-access FAQ cards covering cravings, withdrawal safety, and how family members can help.
   - Interactive search bar to query the AI assistant on neuroscience, brain plasticity, and coping mechanics.

4. **👨‍👩‍👧 Caregiver Support:**
   - Dedicated portal for families.
   - Prompts the model for structured guides categorizing communication templates, behaviors to avoid, positive reinforcement rules, warning signs, and crisis steps.
   - Quick-load configurations for standard family scenarios.

5. **📈 Progress & History Log:**
   - **Sobriety Calendar Milestone:** Set your sobriety start date; calculates and updates your continuous clean days in real-time.
   - **Daily Mood Tracker:** Log daily mood scores (1-5 slider) and personal reflections.
   - **Saved Voice Sessions:** Expand, read, delete, or listen to saved AI dialogues on demand.

6. **🚨 Active Safety Interceptor:**
   - **Multilingual Danger Interception:** Real-time client-side keyword scanner. If a user types or says crisis trigger words (e.g. suicide, overdose, relapse, or their translations in Hindi, Tamil, and Telugu) in any language setting, the app immediately interrupts the flow, blocks the AI query, and displays a prominent warning overlay.
   - Provides one-click buttons to call Emergency Services (911) or the Crisis Hotline (988), alongside pre-written distress text templates to notify their primary caregiver.

7. **⚠️ Contextual Caregiver Suggestion Alert:**
   - Daily mood log history analyzer. If 3 or more consecutive logs evaluate to a low mood score (< 3, corresponding to "Anxious" and "Down" scores), a warning card automatically surfaces on the main dashboard advising the user to check caregiver support. The card is dismissible and resets when a new mood is saved.

---

## 🛠️ Tech Stack

- **Frontend:** React (v19) & Vite
- **Styling:** Tailwind CSS (v4) with dark-mode, glowing panels, and custom typography (Space Grotesk & Plus Jakarta Sans).
- **Icons:** Lucide React
- **Generative AI:** Groq API (llama-3.3-70b-versatile) via native HTTP fetch requests.
- **Browser Web APIs:**
  - **Speech Recognition:** Speech-to-Text (`webkitSpeechRecognition`).
  - **Speech Synthesis:** Text-to-Speech (`window.speechSynthesis`).
- **Persistence:** LocalStorage (for tracking clean days, history log, mood logs, and caregiver info).
- **Test Suite:** Vitest & Happy DOM

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ or v22+)
- NPM (v10+)

### Installation

1. Clone or open the repository folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Groq API Key:
   ```env
   VITE_GROQ_API_KEY=your_actual_api_key_here
   ```
   *(Note: You can get an API Key from the [Groq Console](https://console.groq.com/).)*

*If you do not have an API key immediately available, the application is designed to run perfectly without crashing: you can input the API key at runtime via the **API Settings** panel in the sidebar, or test the pages using pre-baked fallback datasets.*

### Running the App Locally

Start the Vite local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser (preferably Google Chrome or Microsoft Edge for optimal Speech API support).

### Running Unit Tests

Run the Vitest test suites verifying element renders, routing states, and mocks:
```bash
npm run test
```

### ☁️ Hosting on Vercel

To host this project on Vercel:
1. Push the codebase to your GitHub repository.
2. Log in to Vercel and click **Add New Project**.
3. Import the `promptwars-Inperson` repository.
4. Vercel will automatically configure the Vite build framework:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. In the project settings, add the following Environment Variable:
   - **Key:** `VITE_GROQ_API_KEY`
   - **Value:** `gsk_your_groq_api_key_here`
6. Click **Deploy**. Vercel will build and launch your application instantly.

---

## 🛡️ Safety & Disclaimer

RecoverAI is a recovery companion tool powered by AI. It is designed to assist in coping and family coordination. It does not make medical diagnoses, write prescriptions, or replace professional rehabilitation medical therapies. If you are experiencing a life-threatening crisis, call emergency services immediately.
