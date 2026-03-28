# 🩺 CureMe AI

CureMe AI is a health companion web app that provides warm, knowledgeable guidance tailored to a user's medical condition. Users can ask questions about symptoms, diet, medication, and daily habits — and receive clear, caring, non-alarming responses powered by Cohere's AI.

---

## ✨ Features

- **Condition-Aware Chat** — Responses tailored to Diabetes, PCOS, Hypertension, Obesity, or General Health
- **Natural Conversation** — Ask health questions the way you'd ask a knowledgeable friend
- **Firebase Authentication** — Email/password and Google sign-in with persistent sessions
- **Responsive Design** — Works seamlessly on desktop and mobile
- **Non-Alarming Tone** — Calm, caring responses that inform without causing panic
- **Instant Answers** — No appointments, no waiting — guidance in seconds

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| AI | [Cohere](https://cohere.com/) |
| Auth | [Firebase Authentication](https://firebase.google.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Netlify](https://www.netlify.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Cohere API key
- A Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/cureme-ai.git
cd cureme-ai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
# Cohere
COHERE_API_KEY=your_cohere_api_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
cureme-ai/
├── app/
│   ├── page.tsx          # Landing page
│   ├── chat/
│   │   └── page.tsx      # Chat interface
│   └── login/
│       └── page.tsx      # Authentication page
├── lib/
│   └── cohere.ts         # Cohere API integration
├── public/               # Static assets
└── README.md
```

---

## 🌐 Deployment

This project is deployed on **Netlify**. Every push to the `main` branch triggers an automatic production deployment.

Make sure all environment variables are configured in your Netlify project settings under **Site Settings → Environment Variables**.

---

## ⚠️ Disclaimer

CureMe AI is for **informational purposes only** and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for personalized medical guidance.

---

## 👥 Team

This is a private team project. For access or contributions, please contact the project owner directly.