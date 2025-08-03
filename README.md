# 🗣️ AI Chat + Text-to-Speech Web App

A full-stack AI chatbot with text-to-speech support, JWT-based user authentication, and chat history storage using MongoDB.

---

## 🔧 Tech Stack

### Frontend:

- React.js + Vite
- Apollo Client
- Tailwind CSS
- JWT-based auth
- responsiveVoice.js (or Gemini TTS via API)
- Cloudinary (for profile images)

### Backend:

- Node.js
- Express
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- JWT Auth
- Cloudinary image upload
- Azure Blob Storage (for TTS audio files)
- Gemini or Groq for TTS API

---

## 🚀 Features

- 🔐 User authentication (Signup/Login/Change password)
- 💬 AI chat using Gemini or LLM (via Groq)
- 🗣️ Text-to-Speech: auto-generates voice from assistant responses
- 📂 Chat history saved in MongoDB
- 🎧 Audio player with download option
- 🔎 Markdown rendering for messages
- 🎨 Fully responsive UI with light/dark mode support
- 📱 Mobile-friendly design

⸻

⚙️ Environment Variables

.env (root or server)

MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_key (if used)

⸻

🛠️ Setup Instructions

1. Clone the Repo

git clone https://github.com/yogeshrjk/AI-Chat
cd ai-tts-chat

2. Install Dependencies

Server

cd server
npm install

Client

cd client
npm install

⸻

3. Run the App

In separate terminals:

# Start server

cd server
npm run dev

# Start client

cd client
node index.js

⸻

📡 GraphQL Endpoints
• /graphql: Used for login, signup, chat mutations, fetching chat history, and updating profile.

⸻

📃 License

This project is open-source under the Apache License.

⸻

✨ Credits
• Google Gemini API
• Groq API
• responsiveVoice.js
• Cloudinary
• Tailwind CSS
