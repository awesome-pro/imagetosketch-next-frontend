# SketchAI Frontend

A modern Next.js frontend for the Image to Sketch application, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Authentication
- **Cookie-based JWT Authentication**: Secure authentication using HTTP-only cookies
- **Protected Routes**: Automatic redirection and route protection
- **Session Management**: Persistent login state with automatic refresh

### Dashboard
- **Drag & Drop Upload**: Intuitive file upload with preview
- **Real-time Progress**: Live upload and processing progress indicators
- **Sketch Configuration**: Multiple styles, types, and processing methods
- **Statistics Overview**: Visual stats cards showing user activity

### Gallery
- **Grid & List Views**: Toggle between different viewing modes
- **Advanced Filtering**: Search and filter by status, style, etc.
- **Bulk Operations**: Download and delete multiple sketches
- **Modal Preview**: Full-size sketch preview with details

### Real-time Features
- **WebSocket Integration**: Live updates on processing status
- **Toast Notifications**: Instant feedback for all operations
- **Background Processing**: Non-blocking sketch generation

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional interface with shadcn/ui
- **Dark Mode Ready**: Prepared for theme switching
- **Accessible**: ARIA-compliant components

## 🛠 Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide Icons**: Beautiful icon library
- **Axios**: HTTP client with interceptors
- **React Hook Form**: Form management
- **Sonner**: Toast notifications
- **WebSocket**: Real-time communication

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (protected)/           # Protected routes with auth
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── gallery/           # Sketch gallery
│   │   ├── settings/          # User settings
│   │   └── layout.tsx         # Protected layout with navigation
│   ├── auth/                  # Authentication pages
│   ├── api/                   # API routes
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── upload/                # File upload components
│   └── sketch/                # Sketch-related components
├── hooks/                     # Custom React hooks
│   ├── use-auth.tsx           # Authentication hook
│   ├── use-upload.ts          # File upload hook
│   └── use-sketch.ts          # Sketch management hook
├── services/                  # API service layer
│   ├── auth.service.ts        # Authentication API
│   ├── upload.service.ts      # File upload API
│   ├── sketch.service.ts      # Sketch processing API
│   └── websocket.service.ts   # WebSocket service
├── types/                     # TypeScript type definitions
└── lib/                       # Utility functions
```

## ⚙️ Environment Setup

Create a `.env.local` file in the frontend directory:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Production URLs (for deployment)
# NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
# NEXT_PUBLIC_WS_URL=wss://your-backend-domain.com
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Backend API running on port 8000

### Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Open Application**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks

# shadcn/ui Components
pnpm dlx shadcn@latest add [component]  # Add new UI components
```

## 🎨 UI Components

The application uses shadcn/ui components for consistent, accessible UI:

### Currently Installed:
- `avatar` - User profile avatars
- `button` - Interactive buttons
- `card` - Content containers
- `dropdown-menu` - Context menus
- `form` - Form controls
- `input` - Text inputs
- `label` - Form labels
- `select` - Dropdown selectors
- `sonner` - Toast notifications
- `progress` - Progress indicators
- `alert` - Alert messages
- `badge` - Status indicators
- `tabs` - Tab navigation
- `dialog` - Modal dialogs
- `slider` - Range inputs

### Adding New Components:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## 🔌 API Integration

### Service Architecture

The application uses a service-oriented architecture for API calls:

1. **Base API Client** (`lib/api.ts`)
   - Axios instance with interceptors
   - Automatic cookie handling
   - Error handling and retries

2. **Service Layer** (`services/`)
   - `authService` - Authentication operations
   - `uploadService` - File upload with S3 integration
   - `sketchService` - Sketch processing operations
   - `websocketService` - Real-time notifications

3. **Custom Hooks** (`hooks/`)
   - `useAuth` - Authentication state management
   - `useUpload` - File upload state and progress
   - `useSketch` - Sketch operations and state

### Example API Usage:

```typescript
// Using the sketch service
import { sketchService } from '@/services';

const handleCreateSketch = async () => {
  try {
    const result = await sketchService.createSketch({
      input_key: 'uploads/user/image.jpg',
      style: SketchStyle.PENCIL,
      method: 'advanced'
    });
    console.log('Sketch created:', result);
  } catch (error) {
    console.error('Failed to create sketch:', error);
  }
};
```

## 🔄 Real-time Features

### WebSocket Integration

The application includes WebSocket support for real-time updates:

```typescript
// WebSocket connection
import { websocketService } from '@/services';

// Connect (usually done in auth context)
await websocketService.connect(userToken);

// Subscribe to task updates
const unsubscribe = websocketService.subscribeToTaskUpdates((update) => {
  console.log('Task update:', update);
  // Update UI with processing status
});

// Clean up
unsubscribe();
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile Navigation**: Collapsible sidebar with hamburger menu
- **Adaptive Layouts**: Grid layouts that adjust to screen size
- **Touch-Friendly**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## 🔒 Security Features

- **HTTP-only Cookies**: Secure token storage
- **CSRF Protection**: SameSite cookie attributes
- **Input Validation**: Client-side validation with server verification
- **File Type Validation**: Restricted to image files only
- **Size Limits**: 10MB file size limit
- **Error Boundaries**: Graceful error handling

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub/GitLab
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   pnpm dlx vercel
   ```

3. **Set Environment Variables**
   - Add `NEXT_PUBLIC_BACKEND_URL` in Vercel dashboard
   - Add `NEXT_PUBLIC_WS_URL` for WebSocket connections

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Customization

### Adding New Pages

1. **Create Page Component**
   ```typescript
   // app/(protected)/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page Content</div>;
   }
   ```

2. **Add to Navigation**
   ```typescript
   // app/(protected)/layout.tsx
   const navigation = [
     // ... existing items
     { name: 'New Page', href: '/new-page', icon: NewIcon },
   ];
   ```

### Custom Hooks

```typescript
// hooks/use-custom-feature.ts
export function useCustomFeature() {
  const [state, setState] = useState();
  
  // Custom logic here
  
  return { state, actions };
}
```

### Styling

The application uses Tailwind CSS with custom utilities:

```css
/* globals.css - Add custom styles */
@layer utilities {
  .custom-gradient {
    background: linear-gradient(to right, #blue-500, #purple-600);
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```
   Ensure backend CORS settings include frontend domain
   ```

2. **WebSocket Connection Failed**
   ```
   Check WebSocket URL and backend WebSocket server
   ```

3. **File Upload Errors**
   ```
   Verify S3 configuration and presigned URL generation
   ```

4. **Authentication Issues**
   ```
   Clear cookies and check JWT token expiration
   ```

### Debug Mode

Enable debug logging:

```typescript
// Add to .env.local
NEXT_PUBLIC_DEBUG=true
```

## 🤝 Contributing

1. **Code Style**: Follow existing patterns and ESLint rules
2. **Components**: Use shadcn/ui components when possible
3. **Types**: Maintain TypeScript strict mode
4. **Testing**: Add tests for new features
5. **Documentation**: Update README for new features

## 📄 License

This project is part of the Image to Sketch application suite.

---

## 🎯 Next Steps

- [ ] Add image preview in gallery
- [ ] Implement batch operations
- [ ] Add user preferences
- [ ] Enhanced error boundaries
- [ ] Performance monitoring
- [ ] Progressive Web App features

For backend integration details, see the [Backend README](../backend/README.md).