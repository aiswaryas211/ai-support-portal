# 🤖 AI Support Portal

A full-stack AI-powered support platform built to streamline customer service workflows including real-time communication, intelligent ticket management, AI-driven knowledge retrieval, and scalable automation through RAG architecture and LLM integration.

---

## 🚀 Key Features

- Role-based authentication (Admin, Agent, Customer)
- Real-time chat between customer and agent (WebSocket-based)
- Complete ticket lifecycle management
- AI-powered knowledge base with RAG architecture
- Groq LLM integration for fast inference
- YouTube API integration for video-based knowledge ingestion
- Ticket classification and AI-generated summaries
- Administrative analytics dashboard
- RESTful API with secure permission handling
- Modular architecture for scalability and maintainability

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios
- WebSocket integration

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication
- WebSockets
- ChromaDB (Vector Store)
- Groq API
- YouTube Data API
- SQLite

---

## 📂 Project Structure

```
AI_Support_Portal/
│
├── backend/                     # FastAPI REST API and AI services
└── SUPPORT-PORTAL-FRONTEND/     # React client application
```

---

## ⚙️ Installation & Setup

### Backend Setup
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```
cd SUPPORT-PORTAL-FRONTEND
npm install
npm run dev
```

---

## 🔐 User Roles

- Admin → System overview, analytics, performance monitoring  
- Agent → Ticket handling, live chat, customer support  
- Customer → Ticket creation, AI knowledge access, real-time chat  

---

## 🧠 AI Capabilities

- Retrieval-Augmented Generation (RAG) pipeline
- Vector-based document indexing
- LLM-powered ticket classification
- AI-generated summaries
- YouTube content ingestion for knowledge expansion
- Modular AI service layer for scalability

---

## 🎯 Future Enhancements

- Streaming LLM responses
- Docker deployment
- Cloud hosting integration
- Advanced analytics dashboard
- CI/CD pipeline

---

## 👩‍💻 Author

Aiswarya S  
AI & Full-Stack Developer  

---

## ⭐ Project Highlights

- Demonstrates full-stack SaaS architecture
- Implements real-time WebSocket communication
- Integrates Groq-powered LLM services
- Supports RAG-based semantic retrieval
- Built with scalable and modular design principles
