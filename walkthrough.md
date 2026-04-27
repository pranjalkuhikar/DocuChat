# 🚀 DocuChat Technical Walkthrough

DocuChat is a sophisticated RAG (Retrieval-Augmented Generation) application that bridges the gap between static documents/web content and conversational AI.

## 📐 System Architecture

DocuChat follows a decoupled Client-Server architecture:

```mermaid
graph TD
    subgraph Frontend [Next.js Client]
        UI[React UI]
        MD[Markdown Renderer]
        State[Zustand/React State]
    end

    subgraph Backend [Node.js Express Server]
        API[Express API]
        RAG[LangChain RAG Utility]
    end

    subgraph Storage_AI [AI & Data Layer]
        IK[ImageKit PDF Storage]
        CH[Cohere v3 Embeddings]
        PC[Pinecone Vector DB]
        GM[Gemini 1.5 Flash LLM]
    end

    UI --> API
    API --> RAG
    RAG --> IK
    RAG --> CH
    CH --> PC
    RAG --> GM
    GM --> UI
```

## 🔄 The RAG Flow

When you interact with DocuChat, the following "Excalidraw-style" flow occurs:

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Server
    participant VectorDB
    participant LLM

    Note over User, LLM: Document Ingestion Phase
    User->>Client: Upload PDF / Paste URL
    Client->>Server: POST /api/upload OR /api/url
    Server->>Server: Text Extraction & Chunking (1000 tokens)
    Server->>Server: Generate Embeddings (Cohere v3)
    Server->>VectorDB: Upsert Vectors (1024 dimensions)
    Server-->>Client: Success Status

    Note over User, LLM: Conversation Phase
    User->>Client: "What does this document say?"
    Client->>Server: POST /api/chat
    Server->>Server: Embed Query (Cohere v3)
    Server->>VectorDB: Similarity Search (Top 3 Chunks)
    VectorDB-->>Server: Relevant Context
    Server->>LLM: Augmented Prompt (Context + Question)
    LLM-->>Server: Generated Answer
    Server-->>Client: JSON Response
    Client->>User: Formatted Markdown Response
```

## 🛠 Key Enhancements Made

- **Markdown Support**: Added `react-markdown` to render AI responses with full formatting (lists, bold, headers).
- **Session Management**: Implemented `Reset` (local) and `Reset DB` (global Pinecone wipe) features.
- **Model Optimization**: Tuned for **Cohere `embed-english-v3.0`** with specific `search_document` input types for 1024-dim retrieval.
- **Favicon Integration**: Custom branding with the DocuChat logo.
