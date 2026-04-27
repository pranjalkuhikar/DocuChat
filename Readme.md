# 📄 DocuChat

DocuChat is a high-performance **Document & Web Analyzer** built with **LangChain**, **Gemini 1.5 Flash**, and **Pinecone**. It enables users to upload PDF documents or provide website URLs to instantly chat with the content using state-of-the-art **RAG (Retrieval-Augmented Generation)**.

## 🚀 Features

- **PDF Knowledge Extraction**: Upload and vectorize complex PDF documents for instant querying.
- **Web URL Scraper**: Paste any article or website URL to chat with its real-time content.
- **Intelligent Conversations**: Powered by **Google Gemini 1.5 Flash** for low-latency, context-aware responses.
- **Advanced Vector Search**: High-precision retrieval using **Cohere English v3.0 Embeddings** (1024-dim).
- **Rich Markdown UI**: Beautifully formatted AI responses including lists, tables, and code snippets.
- **DB Management**: One-click "Reset DB" to wipe vectors from Pinecone and start a fresh session.
- **Premium Design**: Sleek, dark-mode ready interface built with **Tailwind CSS 4**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- **Orchestration**: [LangChain](https://js.langchain.com/)
- **LLM**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Embeddings**: [Cohere AI (embed-english-v3.0)](https://cohere.com/)
- **Vector DB**: [Pinecone (v5 SDK)](https://www.pinecone.io/)
- **Storage**: [ImageKit](https://imagekit.io/)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd DocuChat
```

### 2. Backend Configuration
Navigate to `server` and create a `.env` file:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_key
COHERE_API_KEY=your_cohere_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

Install and start:
```bash
cd server
npm install
npm start
```

### 3. Frontend Configuration
```bash
cd ../client
npm install
npm run dev
```

---

## 📁 Project Structure

```text
DocuChat/
├── client/              # Next.js Frontend
│   ├── app/             # App Router logic & UI
│   └── public/          # Favicon & Assets
├── server/              # Express Backend
│   ├── src/
│   │   ├── controllers/ # Business logic (Chat, Upload, Clear)
│   │   ├── routes/      # Express API endpoints
│   │   └── utils/       # RAG logic & Scrapers
│   └── uploads/         # Temporary processing
└── README.md
```

---

## 🛡️ Key Functions

- **Hybrid Loader**: Dynamically handles local PDFs, Cloud PDFs (ImageKit), and Web URLs.
- **MRL Embeddings**: Optimized 1024-dimension vector generation for high semantic accuracy.
- **Auto-Cleanup**: Temporary file handling with automated purging post-vectorization.

## 📝 License
This project is licensed under the ISC License.

---
_Built with ❤️ for intelligent document interaction._
