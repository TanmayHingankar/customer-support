# Customer Support AI

A modern, full-stack AI-powered customer support application built with Next.js, TypeScript, MongoDB, and Gemini. The project provides a secure authentication flow, persistent conversation history, AI-generated support replies, PDF-based knowledge ingestion, analytics, and a premium dashboard experience.

## 1. Overview

Customer Support AI is a production-style web application designed to help support teams and product teams automate customer assistance. It combines:

- a polished frontend experience,
- protected backend APIs,
- authentication using JWT cookies,
- conversation storage in MongoDB,
- AI response generation using Gemini,
- PDF upload and retrieval-based question answering.

This project demonstrates how to build a real-world AI assistant experience with a clean architecture, modern UI, and scalable API structure.

## 2. Project Goals

The main goals of this project are to:

- provide an intelligent customer support assistant,
- allow users to chat with AI in a conversational interface,
- store and retrieve chat history,
- support PDF uploads for knowledge-based answering,
- collect feedback through conversation ratings,
- provide basic analytics for support performance,
- show a modern, premium SaaS-style UI.

## 3. Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React for icons
- Sonner for toast notifications

### Backend
- Next.js API Routes
- Node.js
- TypeScript
- JWT for authentication
- Cookie-based auth storage

### Database
- MongoDB Atlas
- Mongoose ODM

### AI / ML
- Gemini API (Gemini 2.5 Flash)
- PDF parsing using pdf-parse
- In-memory retrieval pipeline for PDF-based Q&A support

### Development Tools
- ESLint
- PostCSS
- Tailwind CSS
- TypeScript compiler

## 4. Architecture

The application follows a layered architecture:

1. Frontend UI layer
   - Pages and components render the experience.
   - The client uses fetch-based API calls to communicate with backend routes.

2. API layer
   - Next.js route handlers process requests.
   - Each route handles validation, authentication, persistence, and AI logic.

3. Service layer
   - Authentication helpers manage JWT creation and verification.
   - AI helpers communicate with Gemini.
   - PDF processing and retrieval helpers manage document ingestion.

4. Data layer
   - MongoDB stores users, conversations, and feedback.
   - Mongoose models define schemas and relationships.

### High-Level Flow

```text
User Browser
   │
   ▼
Next.js Frontend
   │
   ├── Auth Pages
   ├── Chat UI
   ├── Analytics UI
   └── Upload PDF UI
   │
   ▼
Next.js API Routes
   │
   ├── Auth APIs
   ├── Chat APIs
   ├── Analytics API
   └── Upload / PDF APIs
   │
   ├── JWT Auth Layer
   ├── Gemini AI Service
   ├── PDF Parser / RAG Helper
   └── MongoDB Models
```

## 5. Folder Structure

```text
src/
├── app/
│   ├── analytics/
│   ├── api/
│   │   ├── analytics/
│   │   ├── ask-pdf/
│   │   ├── auth/
│   │   ├── chat/
│   │   └── upload/
│   ├── chat/
│   ├── login/
│   ├── register/
│   ├── upload/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnalyticsCards.tsx
│   ├── ChatSidebar.tsx
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   └── Navbar.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── mongodb.ts
│   ├── openai.ts
│   └── rag.ts
├── models/
│   ├── Conversation.ts
│   └── User.ts
```

## 6. Features

### Authentication
- User registration with password hashing
- Login using email and password
- JWT issued as an httpOnly cookie
- Protected API access for authenticated users
- Logout support

### AI Chat Assistant
- Users can send support questions directly in the chat interface
- Each message is stored in the conversation history
- The assistant responds with a professional support-style answer
- Conversations are linked to the logged-in user

### Conversation History
- Past conversations are saved to MongoDB
- Users can revisit previous chats
- The sidebar displays summary information and timestamps

### Feedback and Ratings
- Users can rate assistant replies as helpful or not helpful
- Ratings are persisted for analytics and improvement tracking

### PDF Upload and Knowledge Ingestion
- Users can upload PDF documents
- The content is parsed and stored for use in follow-up questions
- The assistant can answer questions using uploaded document knowledge

### Analytics Dashboard
- Total conversations count
- Average rating
- Positive and negative rating counts
- A polished dashboard interface for monitoring support activity

### Premium UI
- Dark premium SaaS-style interface
- Glassmorphism-inspired components
- Responsive layout across desktop and mobile

## 7. Environment Variables

Create a .env.local file in the project root with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Notes
- MONGODB_URI must point to a valid MongoDB instance.
- JWT_SECRET should be a strong random string.
- GEMINI_API_KEY is required for AI response generation.

## 8. Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or pnpm
- MongoDB Atlas account or local MongoDB database
- Gemini API key

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

## 9. API Endpoints

All protected routes rely on the authentication token stored in the cookie.

### Authentication

#### POST /api/auth/register
Creates a new user account and issues an auth cookie.

Request body:
```json
{
  "name": "Tanmay",
  "email": "tanmay@example.com",
  "password": "secret123"
}
```

#### POST /api/auth/login
Authenticates a user and issues a token cookie.

Request body:
```json
{
  "email": "tanmay@example.com",
  "password": "secret123"
}
```

#### GET /api/auth/me
Returns the authenticated user details.

#### POST /api/auth/logout
Clears the auth cookie.

### Chat

#### POST /api/chat
Sends a user message and generates a reply.

Request body:
```json
{
  "message": "How do I reset my password?",
  "conversationId": "optional-existing-conversation-id"
}
```

Response:
```json
{
  "reply": "Here is a helpful answer...",
  "conversationId": "conversation-id"
}
```

#### GET /api/chat/history
Returns the authenticated user’s conversation history.

#### POST /api/chat/rating
Stores a helpful or not helpful rating for a conversation.

Request body:
```json
{
  "conversationId": "conversation-id",
  "rating": "helpful"
}
```

### Analytics

#### GET /api/analytics
Returns summary analytics for all conversations and ratings.

### PDF Upload

#### POST /api/upload
Uploads a PDF file and extracts its text for knowledge use.

Form data:
- file: PDF file

#### POST /api/ask-pdf
Answers questions based on uploaded document content.

## 10. Working Flow

### User Registration / Login
1. The user opens the app.
2. They register or log in.
3. A JWT is created and stored in an httpOnly cookie.
4. The session is validated on future requests.

### Chat Interaction
1. The user types a support question.
2. The frontend sends the message to /api/chat.
3. The backend loads or creates a conversation.
4. The message history is included in the request context.
5. Gemini generates a response.
6. The reply is saved to the conversation and returned to the frontend.

### PDF Knowledge Flow
1. The user uploads a PDF file.
2. The backend parses the PDF using pdf-parse.
3. The extracted text is stored for retrieval.
4. Future questions can be answered using the uploaded document knowledge.

### Ratings and Analytics
1. The user optionally rates an assistant reply.
2. The rating is stored in MongoDB.
3. Analytics endpoints aggregate rating trends and conversation counts.

## 11. Database Models

### User
Stores:
- name
- email
- password (hashed)
- createdAt

### Conversation
Stores:
- userId
- messages
- rating
- title
- createdAt

## 12. Security Considerations

The project uses several practices to improve security:

- Passwords are hashed using bcrypt.
- JWT tokens are stored in httpOnly cookies.
- API routes verify authentication before allowing access.
- Sensitive environment variables are stored in .env.local.

## 13. Future Enhancements

Potential improvements for the project include:

- real vector-based RAG with embeddings and vector search,
- multi-user admin dashboard,
- support for multiple AI providers,
- conversation search and tagging,
- export of chat history,
- automated evaluation and testing,
- role-based access control.

## 14. License

This project is available for educational and personal use. Add a LICENSE file if you want to publish it under a formal license.

## 15. Screenshots 

<img width="1917" height="965" alt="Screenshot 2026-06-27 221625" src="https://github.com/user-attachments/assets/22b03ed0-737b-418f-8fb9-e518ef808ca5" />
<img width="1912" height="975" alt="Screenshot 2026-06-27 221616" src="https://github.com/user-attachments/assets/d78ff667-0d5c-487a-84a1-f94f7705a268" />
<img width="1917" height="965" alt="Screenshot 2026-06-27 221625" src="https://github.com/user-attachments/assets/f67abaac-aef0-4a30-9d15-c7d85bf38388" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221430" src="https://github.com/user-attachments/assets/df9a9771-dab1-473f-9567-e70daf3158bb" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 154038" src="https://github.com/user-attachments/assets/1aaa9185-476c-46d0-8b37-508707093748" />
<img width="1917" height="965" alt="Screenshot 2026-06-27 221444" src="https://github.com/user-attachments/assets/dd2983c3-721c-42e4-a0fb-596a2eb4d2d9" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 155532" src="https://github.com/user-attachments/assets/c2e893de-f93c-4c16-9b5e-52133227ee11" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 154038" src="https://github.com/user-attachments/assets/673655f5-d4f0-4801-b750-4a7d1783a028" />
<img width="1917" height="965" alt="Screenshot 2026-06-27 221444" src="https://github.com/user-attachments/assets/db85ee62-c8ab-43ec-a683-3c3e9df75fd2" />
<img width="1916" height="867" alt="Screenshot 2026-06-27 163731" src="https://github.com/user-attachments/assets/6720521f-767e-47b2-a4ac-9dc4e5bfad53" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 154038" src="https://github.com/user-attachments/assets/01509684-beea-46ca-8983-c6cb38dd1d0e" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 155532" src="https://github.com/user-attachments/assets/7d252ef3-282a-4204-bdb9-a848c566954b" />
<img width="1920" height="1080" alt="Screenshot 2026-06-27 155532" src="https://github.com/user-attachments/assets/2f042148-990d-4845-af64-1f23e30ab857" />
<img width="1915" height="966" alt="Screenshot 2026-06-27 202144" src="https://github.com/user-attachments/assets/5875a032-9fd7-4bec-a011-d6e5f99314c8" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221418" src="https://github.com/user-attachments/assets/47ac451f-5bd0-4fa3-b887-701c3a36e4fe" />
<img width="1916" height="867" alt="Screenshot 2026-06-27 163731" src="https://github.com/user-attachments/assets/81935c00-f4e6-49fe-b279-b0d5f530e1f7" />
<img width="1916" height="867" alt="Screenshot 2026-06-27 163731" src="https://github.com/user-attachments/assets/a2eb0c1e-30eb-4e24-8385-294b54960ea9" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221430" src="https://github.com/user-attachments/assets/defce7e8-5120-427e-9d8d-e9841d066bdb" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221418" src="https://github.com/user-attachments/assets/46b524a7-783f-4864-8e69-27fd8a3dd698" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221418" src="https://github.com/user-attachments/assets/f345bea6-b0bf-46ac-9e0c-282c58201cad" />
<img width="1916" height="867" alt="Screenshot 2026-06-27 163731" src="https://github.com/user-attachments/assets/467713e3-d126-4473-9a95-ee9897a7d81d" />
<img width="1916" height="867" alt="Screenshot 2026-06-27 163731" src="https://github.com/user-attachments/assets/5d3b36a6-ac92-4eba-8b71-9a63efd2c919" />
<img width="1915" height="966" alt="Screenshot 2026-06-27 202144" src="https://github.com/user-attachments/assets/c044ed81-937b-4c57-b265-4e8e50e4c51b" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221430" src="https://github.com/user-attachments/assets/e83eb430-047f-4ae4-a8c4-c9d3149fbb86" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221418" src="https://github.com/user-attachments/assets/d66b08ec-babc-4f62-88f9-f14becf1e5a1" />
<img width="1917" height="970" alt="Screenshot 2026-06-27 221430" src="https://github.com/user-attachments/assets/3bd85292-3893-4309-95fb-6cdb5d79a179" />
<img width="1917" height="965" alt="Screenshot 2026-06-27 221444" src="https://github.com/user-attachments/assets/db6f1717-4742-4c07-9581-25b2a75a00c7" />
<img width="1916" height="958" alt="Screenshot 2026-06-27 221457" src="https://github.com/user-attachments/assets/b246d31b-1f78-4c42-8018-ed9bb42c0021" />
<img width="1907" height="1021" alt="Screenshot 2026-06-27 221517" src="https://github.com/user-attachments/assets/8d4401d8-4f43-4bd3-bd1c-02b673775d35" />

## 16. Author

Built by Tanmay Hingankar.
