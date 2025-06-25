# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Package Management
- `npm install` - Install dependencies
- Remove pnpm-lock.yaml if present (project uses npm)

## Project Architecture

### Framework & Tech Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+ with shadcn/ui components
- **Authentication**: Clerk with custom middleware
- **Database**: Supabase (PostgreSQL) with custom service layer
- **State Management**: React Context (SettingsContext)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast messages

### Key Application Features
- Financial management platform with multi-account support
- Invoice management and payment processing
- Project tracking and team management
- Investment portfolio tracking
- Analytics dashboard with custom reports
- Organization management with role-based access

### Architecture Patterns

#### Authentication Flow
```
Clerk (Frontend Auth) → lib/auth.ts → Database User Profiles → Organization Membership
```
- Clerk handles UI authentication
- `lib/auth.ts` manages user profile creation and organization access
- `middleware.ts` protects routes with Clerk
- User profiles stored in Supabase with organization relationships

#### Database Layer
```
Components → lib/database.ts → Supabase Client → PostgreSQL
```
- `lib/database.ts` provides typed service layer
- All database operations return `{ data, error }` pattern
- Graceful fallback when Supabase not configured
- Comprehensive entity types (UserProfile, Organization, Account, etc.)

#### State Management
```
SettingsProvider → SettingsContext → Components
```
- Centralized state in `contexts/settings-context.tsx`
- Manages user settings, business data, and application state
- LocalStorage persistence for user preferences
- Data clearing functions for development/testing

#### Unsaved Changes Protection
```
useUnsavedChanges Hook → UnsavedChangesBar Component → Browser beforeunload
```
- Automatic change detection via deep comparison
- Prevents data loss on page navigation
- Save/reset functionality with loading states

### Directory Structure Deep Dive

#### `/app` - Next.js App Router
- Page-based routing with layout.tsx hierarchy
- Each feature has dedicated page (analytics, invoices, etc.)
- Authentication pages in `/sign-in` and `/sign-up`
- API routes in `/api` for server-side operations

#### `/components` - Reusable UI Components
- `/ui` - shadcn/ui base components (buttons, forms, etc.)
- `/analytics` - Chart and analytics components
- `/investor` - Investment tracking components
- Feature-specific components with consistent naming

#### `/lib` - Core Utilities
- `auth.ts` - Authentication service and organization management
- `database.ts` - Comprehensive database service layer
- `supabase.ts` - Supabase client configuration
- `utils.ts` - Common utility functions

#### `/contexts` - React Context Providers
- `settings-context.tsx` - Application-wide state management
- `auth-context.tsx` - Authentication state (if used)

#### `/hooks` - Custom React Hooks
- `use-unsaved-changes.tsx` - Form change detection
- `use-toast.ts` - Toast notification management
- `use-mobile.tsx` - Mobile responsive detection

### Environment Configuration

#### Required Environment Variables
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Database
DATABASE_URL=postgresql://xxx
```

#### Graceful Fallbacks
- Application works without Supabase configuration
- Database operations return mock data when unavailable
- Authentication still functions through Clerk
- Settings persist in localStorage

### Database Schema Overview

#### Core Entities
- `user_profiles` - Clerk user integration with app preferences
- `organizations` - Business entities with settings
- `organization_members` - User-organization relationships with roles
- `accounts` - Financial accounts with balances
- `transactions` - Financial transactions with categorization
- `projects` - Project management with budget tracking
- `invoices` - Invoice management with status tracking
- `payments` - Payment processing records
- `meetings` - Meeting scheduling and management

#### Relationships
- Users belong to organizations through membership
- Accounts, transactions, projects tied to organizations
- Projects can have associated invoices and payments
- Meetings can be linked to projects

### Component Patterns

#### Data Fetching
```typescript
// Use database service with error handling
const { data: accounts, error } = await db.getAccounts(organizationId)
if (error) {
  toast.error('Failed to load accounts')
  return
}
```

#### Form Management
```typescript
// Combine with unsaved changes protection
const { hasUnsavedChanges, handleSave, handleReset } = useUnsavedChanges({
  initialData,
  currentData,
  onSave: async (data) => await saveFunction(data),
  onReset: () => resetForm()
})
```

#### Settings Usage
```typescript
// Access global settings and data
const { settings, updateSettings, organizationData } = useSettings()
```

### Styling Conventions
- Use Tailwind CSS classes consistently
- Prefer shadcn/ui components over custom UI
- Support dark/light mode through next-themes
- Responsive design with mobile-first approach
- PHP currency formatting throughout application

### Development Workflow
1. Check environment variables are configured
2. Run `npm install` to ensure dependencies
3. Use `npm run dev` for development
4. Check `npm run lint` before committing
5. Test database connection via components/database-connection-status.tsx

### Testing Strategy
- No test framework currently configured
- Manual testing through development server
- Database connection testing via API routes
- Clerk authentication testing through sign-in flow