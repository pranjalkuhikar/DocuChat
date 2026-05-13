# DocuChat Frontend - Architecture & Structure

## 📁 Project Structure

```
client/
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles & animations
├── components/
│   ├── Header.tsx         # Header with status & controls
│   ├── Sidebar.tsx        # Left sidebar layout
│   ├── FileUpload.tsx     # PDF upload component
│   ├── URLAnalyzer.tsx    # URL analysis component
│   ├── MessageList.tsx    # Chat messages display
│   ├── ChatInput.tsx      # Chat input form
│   └── index.ts           # Component exports
├── hooks/
│   ├── useChat.ts         # Chat logic hook
│   ├── useDocumentUpload.ts # Upload logic hook
│   ├── useScrollToBottom.ts # Auto-scroll hook
│   └── index.ts           # Hook exports
├── services/
│   └── api.ts             # API client & error handling
├── types/
│   └── index.ts           # TypeScript type definitions
├── config/
│   └── api.ts             # Configuration constants
└── public/
    └── [assets]           # Static files
```

## 🎯 Key Features

### 1. **Component-Based Architecture**

- Each UI element is a separate, reusable component
- Components receive props for data and callbacks
- Clear separation of concerns

### 2. **Custom Hooks**

- `useChat` - Manages conversation state and logic
- `useDocumentUpload` - Handles file/URL uploads with validation
- `useScrollToBottom` - Auto-scrolls to latest message

### 3. **API Service Layer**

- Centralized API calls in `services/api.ts`
- Custom `ApiError` class for error handling
- Strongly typed responses

### 4. **Type Safety**

- Full TypeScript with `strict` mode enabled
- Type definitions in `types/index.ts`
- Type-safe API responses

### 5. **Configuration Management**

- Centralized config in `config/api.ts`
- Environment variable support (NEXT_PUBLIC_API_URL)
- File size and message limits configurable

## 🚀 Getting Started

### Installation

```bash
cd client
npm install
npm run dev
```

### Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 📱 Components Overview

### Header

- Logo and branding
- Status messages with color-coded feedback
- Reset and Clear DB buttons

### Sidebar

- Active document indicator
- File upload with drag & drop
- URL analyzer form
- Tech stack badges

### FileUpload

- Drag and drop support
- File validation (PDF only, 25MB max)
- Error messages

### URLAnalyzer

- URL input field
- URL format validation
- Loading states

### MessageList

- User and assistant messages
- Markdown rendering with custom components
- Loading animation
- Auto-scroll on new messages

### ChatInput

- Text input with placeholder
- Send button with keyboard support
- Disabled state during loading

## 🎨 Styling

### Design System

- **Color Scheme**: Zinc with Blue accents
- **Dark Mode**: Full support with `dark:` classes
- **Spacing**: Consistent gap/padding system
- **Typography**: Geist font family

### Tailwind CSS 4

- Utility-first approach
- Responsive design
- Dark mode support
- Custom animations

### Custom Animations

- Fade-in on messages
- Slide-in from bottom
- Bounce animation for loading dots
- Smooth transitions on hover

## 🔄 Data Flow

```
User Input
    ↓
Component State (useState)
    ↓
Custom Hook (useChat, useDocumentUpload)
    ↓
API Service (apiService)
    ↓
Backend API
    ↓
Response → Update State
    ↓
Re-render Component
```

## 📝 Validation

### Client-Side Validation

- **File Upload**: Type (PDF) and size (25MB)
- **URL**: Valid URL format
- **Messages**: Length (3-500 chars)

### Server-Side Validation

- All validations also enforced on backend
- Additional security checks

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus-visible styles
- High contrast mode support

## 🔍 Error Handling

### Try-Catch Pattern

All async operations wrapped in try-catch with user-friendly error messages

### Error Types

- File validation errors
- URL format errors
- API errors with specific messages
- Network errors

### User Feedback

- Color-coded status messages
- Error text in components
- Toast-like notifications

## 📊 Performance Optimizations

- Code splitting with dynamic imports (automatic via Next.js)
- Component memoization (React.memo where appropriate)
- Efficient re-renders with hooks
- Optimized images and assets

## 🧪 Testing Considerations

### Unit Tests (components)

```typescript
// Example: Test FileUpload component
test("validates file before upload", () => {
  // Implementation
});
```

### Integration Tests (hooks)

```typescript
// Example: Test useChat hook
test("sends message and updates state", () => {
  // Implementation
});
```

## 🚀 Deployment

### Build

```bash
npm run build
```

### Environment Variables

Set `NEXT_PUBLIC_API_URL` to your production API domain

### Hosting Options

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Self-hosted

## 📚 Best Practices

1. **Always use components from `/components`**
   - Keep reusable UI in components
   - Pass props for configuration

2. **Use custom hooks for business logic**
   - Keep page.tsx clean
   - Extract state management to hooks

3. **Centralize API calls**
   - Use `apiService` for all API calls
   - Never fetch directly in components

4. **Type everything**
   - Use proper TypeScript types
   - Avoid `any` type

5. **Style consistently**
   - Use Tailwind utility classes
   - Follow the design system

6. **Handle errors gracefully**
   - Show user-friendly messages
   - Never expose sensitive error details

## 🔧 Common Tasks

### Adding a New Component

1. Create file in `components/`
2. Export from `components/index.ts`
3. Import and use in page/other components

### Adding an API Endpoint

1. Add method to `services/api.ts`
2. Update `config/api.ts` endpoints
3. Add type definitions in `types/index.ts`
4. Use in hook or component

### Modifying Styling

- Update global styles in `globals.css`
- Use Tailwind classes in components
- Follow dark mode conventions

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
