# 🩺 CureMe AI

CureMe AI is a personalised health companion web app that provides warm, knowledgeable guidance tailored to a user's medical profile and condition. Users sign up, complete a health survey, and can then ask questions about symptoms, diet, medication, and daily habits — receiving clear, caring, non-alarming responses powered by Google Gemini AI.

---

## ✨ Features

- **Condition-Aware Chat** — Responses tailored to Diabetes, PCOS, Hypertension, Obesity, or General Health
- **Personalised Health Profile** — Survey collects age, gender, height, weight, health issues, medications, and allergies — all used to personalise every AI response
- **BMI-Aware Responses** — BMI is calculated automatically and factored into dietary and lifestyle advice
- **Medication & Allergy Safety** — AI never suggests foods or remedies that conflict with the user's allergies or current medications
- **Natural Conversation** — Ask health questions the way you'd ask a knowledgeable friend
- **Firebase Authentication** — Email/password and Google sign-in with persistent sessions
- **Chat History** — Conversations are saved per user in Firestore and restored on every sign-in
- **Edit Profile Anytime** — Users can update their health profile from the nav dropdown
- **Responsive Design** — Works seamlessly on desktop and mobile
- **Non-Alarming Tone** — Calm, caring responses that inform without causing panic
- **Instant Answers** — No appointments, no waiting — guidance in seconds

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| AI | [Google Gemini](https://ai.google.dev/) |
| Auth | [Firebase Authentication](https://firebase.google.com/) |
| Database | [Cloud Firestore](https://firebase.google.com/products/firestore) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Netlify](https://www.netlify.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Google Gemini API key
- A Firebase project with Authentication and Firestore enabled

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
# Gemini
GEMINI_API_KEY=your_gemini_api_key

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
│   ├── page.tsx            # Landing page (auth-aware nav)
│   ├── chat/
│   │   └── page.tsx        # Chat interface with profile-aware AI
│   ├── login/
│   │   └── page.tsx        # Authentication (email + Google)
│   └── survey/
│       └── page.tsx        # 3-step health profile survey
├── lib/
│   └── gemini.ts           # Gemini API integration
├── public/                 # Static assets
└── README.md
```

---

## 🗄 Firestore Data Structure

```
firestore/
├── profiles/
│   └── {uid}/
│       ├── age
│       ├── gender
│       ├── heightCm
│       ├── weightKg
│       ├── healthIssues
│       ├── medications
│       ├── allergies
│       └── updatedAt
└── chats/
    └── {uid}/
        └── messages/
            └── {messageId}/
                ├── role        # "user" | "assistant"
                ├── content
                └── timestamp
```

---

## 🔐 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /chats/{uid}/messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## 🔄 User Flow

```
Sign Up → Health Survey (3 steps) → Chat
Sign In → Chat (survey skipped if already completed)
Chat Nav → Edit Profile → Update survey → Back to Chat
Chat Nav → Clear Chat → Wipes conversation history
```

---

## 🌐 Deployment

This project is deployed on **Netlify**. Every push to the `main` branch triggers an automatic production deployment.

Make sure all environment variables are configured in your Netlify project settings under **Site Settings → Environment Variables**.

---

## ⚠️ Disclaimer

CureMe AI is for **informational purposes only** and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for personalised medical guidance.

---

## 👥 Team

This is a private team project. For access or contributions, please contact the project owner directly.