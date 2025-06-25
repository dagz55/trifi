# TriFi Setup Guide

This guide walks you through setting up TriFi for development and production environments.

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/trifi.git
cd trifi

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Environment Configuration

Create `.env.local` with the following variables:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase (Optional - app works without database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (Optional)
DATABASE_URL=postgresql://user:pass@host:port/database
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Setup (Clerk)

### 1. Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose your authentication methods
4. Copy your API keys

### 2. Configure Clerk Settings

In your Clerk Dashboard:

- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up` 
- **After sign-in URL**: `/`
- **After sign-up URL**: `/`

### 3. Add Environment Variables

Add your Clerk keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

## 💾 Database Setup (Optional)

TriFi works in demo mode without a database, but you can connect Supabase for full functionality.

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API to get your keys

### 2. Set up Database Schema

Run the SQL commands in `database/schema.sql` in your Supabase SQL editor.

### 3. Configure Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
trifi/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── analytics/         # Analytics dashboard
│   ├── invoices/          # Invoice management
│   ├── projects/          # Project tracking
│   ├── members/           # Team management
│   └── settings/          # User preferences
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── analytics/        # Analytics components
│   ├── modals/           # Modal components
│   └── forms/            # Form components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🎨 Customization

### Styling
- Uses Tailwind CSS for styling
- Components built with shadcn/ui
- Dark/light mode support via next-themes

### Theme Configuration
Edit `tailwind.config.js` to customize:
- Colors
- Typography
- Spacing
- Breakpoints

### Component Library
All UI components are in `components/ui/` and can be customized:
- Button variants
- Form controls
- Layout components
- Data display components

## 🧪 Testing

### Manual Testing
1. Start development server: `npm run dev`
2. Test authentication flow
3. Test all major features:
   - Dashboard overview
   - Project creation
   - Team management
   - Invoice generation
   - Settings management

### Build Testing
```bash
# Test production build
npm run build
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

## 📦 Features Overview

### ✅ Core Features
- **Dashboard**: Financial overview and quick actions
- **Projects**: Project management with progress tracking
- **Team**: Member management and role assignment
- **Invoices**: Professional invoice creation and tracking
- **Analytics**: Financial reports and data visualization
- **Settings**: User preferences and data management

### ✅ Authentication
- Secure user authentication via Clerk
- Sign-in/sign-up flows
- Protected routes
- User profile management

### ✅ Data Management
- Local state management via React Context
- Optional database integration with Supabase
- Data persistence in localStorage
- Export functionality

### ✅ UI/UX
- Responsive design for all devices
- Dark/light mode toggle
- Accessible components
- Smooth animations and transitions

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `DATABASE_URL` | No | PostgreSQL connection string |

### Feature Flags
You can enable/disable features by modifying the settings context:

```typescript
// contexts/settings-context.tsx
const defaultSettings = {
  features: {
    enableDatabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? true : false,
    enableAnalytics: true,
    enableInvoicing: true,
    enableProjectManagement: true,
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 2. Environment Variables Not Loading
- Ensure `.env.local` is in the root directory
- Restart the development server after changes
- Check variable names have correct prefixes

#### 3. Authentication Issues
- Verify Clerk keys are correct
- Check Clerk dashboard configuration
- Ensure redirect URLs match your setup

#### 4. Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS
- Verify component imports

### Getting Help

1. Check the [documentation](./README.md)
2. Review the [deployment guide](./deployment.md)
3. Check the [API documentation](./api.md)
4. Look at component examples in the codebase

## 📈 Performance Tips

### Development
- Use `npm run dev` for hot reloading
- Enable React DevTools
- Use browser developer tools for debugging

### Production
- Optimize images and assets
- Enable compression
- Use CDN for static files
- Monitor Core Web Vitals

## 🔒 Security Considerations

### Development
- Never commit `.env.local` to version control
- Use different keys for development and production
- Regularly update dependencies

### Production
- Use environment variables for all secrets
- Enable HTTPS
- Configure proper CORS policies
- Implement rate limiting
- Regular security audits

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

Ready to start building with TriFi! 🚀