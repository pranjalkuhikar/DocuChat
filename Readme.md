# 📄 DocuChat

DocuChat is a powerful **Document & Web Analyzer** built with **LangChain**, **Gemini AI**, and **Pinecone**. It allows users to upload PDF documents or provide website URLs to instantly chat with the content using advanced RAG (Retrieval-Augmented Generation) technology.

## 🚀 Features

- **PDF Analysis**: Upload and extract knowledge from complex PDF documents.
- **Web URL Analysis**: Provide any article or website URL to chat with its content.
- **Intelligent Chat**: Powered by Google Gemini 1.5 Flash for fast and accurate responses.
- **Vector Search**: Uses Pinecone and Cohere Embeddings for high-performance context retrieval.
- **Modern UI**: A sleek, dark-mode ready interface built with Next.js 15 and Tailwind CSS 4.
- **Monolithic Backend**: Clean Express.js architecture with automated temporary file cleanup.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **AI Orchestration**: [LangChain](https://js.langchain.com/)
- **LLM**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Embeddings**: [Cohere AI](https://cohere.com/)
- **Vector Database**: [Pinecone](https://www.pinecone.io/)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd DocuChat
```

### 2. Backend Configuration

Navigate to the `server` folder and create a `.env` file:

```bash
cd server
# Create .env and add your keys:
PORT=3001
GEMINI_API_KEY=your_gemini_key
COHERE_API_KEY=your_cohere_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
```

Install dependencies and start the server:

```bash
npm install
npm start
```

### 3. Frontend Configuration

Navigate to the `client` folder, install dependencies, and start the development server:

```bash
cd ../client
npm install
npm run dev
```

---

## 📁 Project Structure

```
DocuChat/
├── client/              # Next.js Frontend
│   ├── app/             # App Router logic
│   └── public/          # Static assets
├── server/              # Express Backend
│   ├── src/
│   │   ├── config/      # Environment variables
│   │   ├── controllers/ # API logic
│   │   ├── routes/      # Express routes
│   │   └── utils/       # RAG logic & Multer
│   └── uploads/         # Temporary storage (auto-cleaned)
└── README.md
```

---

## 🛡️ Key Functions

- **PDF Loading**: Uses `PDFLoader` to chunk and vectorize documents.
- **Web Scraping**: Uses `CheerioWebBaseLoader` for fast URL content extraction.
- **RAG Chain**: Combines similarity search with Gemini for context-aware answering.

## 📝 License

This project is licensed under the ISC License.

---

_Built with ❤️ for intelligent document interaction._
