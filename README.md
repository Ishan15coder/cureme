# 🩺 CureMe AI

CureMe AI is a personalised health companion web app that provides warm, knowledgeable guidance tailored to a user's medical profile and condition. Users sign up, complete a health survey, and can then ask questions about symptoms, diet, medication, and daily habits — receiving clear, caring, non-alarming responses powered by Cohere AI.

---

✨ Features

Personalised Health Profile — 3-step survey collects age, gender, height, weight, health issues, medications, and allergies
BMI-Aware Responses — BMI is calculated automatically and factored into every AI response
Medication & Allergy Safety — AI never suggests anything that conflicts with the user's allergies or medications
Condition-Aware Chat — Responses tailored to Diabetes, PCOS, Hypertension, Obesity, or General Health
Health Dashboard — Visual BMI gauge, health score ring, and profile summary with body metrics
Chat History — Conversations saved per user in Firestore and restored on every sign-in
Firebase Authentication — Email/password and Google sign-in with persistent sessions
Edit Profile Anytime — Update health profile from the nav dropdown
Clear Chat — Wipe conversation history with one click
Responsive Design — Works seamlessly on desktop and mobile
Non-Alarming Tone — Calm, caring responses that inform without causing panic

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| AI | [Cohere](https://cohere.com/) |
| Auth | [Firebase Authentication](https://firebase.google.com/) |
| Database | [Cloud Firestore](https://firebase.google.com/products/firestore) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Netlify](https://www.netlify.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Cohere API key
- A Firebase project with Authentication and Firestore enabled

📁 Project Structure

```
cureme-ai/
├── app/
│   ├── page.tsx              # Landing page (auth-aware nav)
│   ├── chat/
│   │   └── page.tsx          # Chat interface with profile-aware AI
│   ├── login/
│   │   └── page.tsx          # Authentication (email + Google)
│   ├── survey/
│   │   └── page.tsx          # 3-step health profile survey
│   └── dashboard/
│       └── page.tsx          # Health dashboard with BMI gauge
├── lib/
│   └── cohere.ts             # Cohere API integration
├── public/
└── README.md

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