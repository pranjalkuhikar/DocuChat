# DocuChat - Setup & Configuration Guide

## 🚀 Key Updates Implemented

### Backend Improvements
1. ✅ **File Validation** - Validates PDF files (max 25MB, PDF type only)
2. ✅ **URL Validation** - Validates URL format before processing
3. ✅ **Message Validation** - Validates chat messages (3-500 characters)
4. ✅ **Request Timeout** - 120-second timeout on all requests to prevent hanging
5. ✅ **Better Error Messages** - More specific error responses for better debugging
6. ✅ **Improved RAG** - Smaller chunks (500 chars) for better relevance

### Frontend Improvements
1. ✅ **Environment Configuration** - API URL now configurable via `.env.local`
2. ✅ **Better Error Handling** - More specific error messages

## 📋 Setup Instructions

### Server Setup
```bash
cd server
npm install
# Ensure .env is configured with API keys
npm start
```

### Client Setup
```bash
cd client
npm install
npm run dev
```

## 🔧 Environment Variables

### Server (.env)
```
PORT=3001
GEMINI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_INDEX=rag
COHERE_API_KEY=your_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, change to:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🔒 Validation Rules

### File Upload
- Max size: 25MB
- Format: PDF only
- Required field

### URL Processing
- Must be valid URL format
- Supports: PDFs, HTML pages, web content

### Chat Messages
- Minimum: 3 characters
- Maximum: 500 characters

## ⏱️ Request Timeouts
- Default timeout: 120 seconds
- Long PDF processing may take time
- If timeout occurs, you'll get a clear error message

## 🐛 Troubleshooting

### "PDF too large"
- Files over 25MB are rejected
- Compress your PDF or split into smaller files

### "Invalid URL"
- Check URL format (should start with http:// or https://)
- Ensure the domain is accessible
- Some websites may block automated access

### "No text found"
- PDF may be image-based (scanned document)
- Try uploading a text-based PDF
- Website might have no extractable content

### Request Timeout
- Server took too long to process
- Try with a smaller PDF
- Simplify your question

## 📊 Performance Tips

1. **Smaller PDFs** - Upload documents under 10MB for faster processing
2. **Specific Questions** - Ask focused questions for better answers
3. **Clear Language** - Use clear, direct phrasing
4. **One Topic** - Ask about one topic per question

## 🔄 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | Upload PDF file |
| POST | `/api/url` | Process URL/website |
| POST | `/api/chat` | Send chat message |
| DELETE | `/api/clear` | Clear vector database |

## 📝 Example Requests

### Upload PDF
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "pdf=@document.pdf"
```

### Process URL
```bash
curl -X POST http://localhost:3001/api/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Chat
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this document about?"}'
```

## 🎯 Next Steps for Production

1. **Deploy Server** - Use Heroku, Vercel, or AWS
2. **Update Client URL** - Change `NEXT_PUBLIC_API_URL` to production domain
3. **Add Rate Limiting** - Prevent API abuse
4. **Add Authentication** - Secure your API endpoints
5. **Enable CORS** - Restrict to your domain only
6. **Monitor Logs** - Track errors and usage patterns
7. **Implement Caching** - Cache common responses
8. **Add User Sessions** - Track which user uploaded what

