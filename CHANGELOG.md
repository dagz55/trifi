# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🔧 Major Database Fixes
- **JWT Authentication Policies**: Comprehensive fix for "bigint = uuid" operator errors
  - Created centralized `get_current_user_id()` helper function for consistent user authentication
  - Fixed all RLS policies across chat system, organizations, and user management
  - Eliminated type casting issues in PostgreSQL queries
  - Made all migrations idempotent with proper `IF NOT EXISTS` checks
  - Added comprehensive migration (0007) that drops and recreates all problematic policies

### 🎨 Improved
- **Database Schema**: Enhanced migration reliability and consistency
  - All table creation statements now use `CREATE TABLE IF NOT EXISTS`
  - Added conditional policy and trigger creation to prevent conflicts
  - Improved error handling in data insertion statements
- **Dashboard Overview Cards**: Fixed text truncation and sizing issues
  - Removed redundant grid layout causing card constraints
  - Enhanced card spacing and padding for better content display
  - Improved text handling with proper wrapping and truncation
  - Added responsive layout optimizations
  - Enhanced visual balance and readability

### 🔧 Fixed
- **Migration System**: Resolved multiple critical database migration issues
  - Fixed "relation already exists" errors by making migrations idempotent
  - Eliminated JWT extraction type mismatches in RLS policies
  - Added proper function parameter naming to avoid reserved keyword conflicts
- **UI Layout**: Resolved double grid structure causing improper card sizing
- **Text Display**: Fixed text overflow and truncation in dashboard cards
- **Responsive Design**: Improved card layout across different screen sizes

### Fixed
- Fixed Create Organization button functionality with improved error handling
- Added better error messages for database configuration issues
- Improved console logging for debugging organization creation
- Fixed avatar image loading errors with proper error handling
- Updated manifest.json to reference correct icon files
- Added comprehensive troubleshooting guide for setup issues
- Fixed storage bucket creation error by applying proper RLS policies migration
- Improved error handling for photo upload functionality
- Updated storage setup to work with hosted Supabase environment

### Added
- Database connection status indicators in organization page
- Detailed error codes for different failure scenarios
- Environment variable setup instructions in UI
- Improved user feedback for database connectivity issues

### Changed
- Enhanced Create Organization modal with better error reporting
- Improved database service error handling with specific error codes
- Updated README with troubleshooting section for common issues
- Enhanced photo upload error messages to be more user-friendly
- Updated storage migration to avoid superuser privilege requirements
- Updated navigation and all logo references to use the official TriFi-logo.png.
- Updated app/layout.tsx metadata to use TriFi-logo.png for all icons (favicon, shortcut, apple-touch).
- Updated public/manifest.json to use TriFi-logo.png as the only app icon for all platforms.
- Updated TriFiLogo component to render TriFi-logo.png for the default variant.
- Restored the previous modern, sleek, and fancy landing page and logo style (gradient text logo and SVG-based TriFiLogo component).

---

## [2.0.0] - 2025-01-09

### 🚨 BREAKING CHANGES
- **Authentication System Migration**: Complete migration from Clerk to Supabase Auth
- Existing user sessions will be invalidated and users will need to sign in again
- Authentication API endpoints have changed
- Environment variables have been updated (see Migration Guide below)

### ✨ Added
- **Supabase Authentication Integration**
  - Custom email/password authentication flows
  - Secure session management with JWT tokens
  - Password reset functionality via email
  - User profile management through Supabase
  
- **Enhanced Authentication UI**
  - Beautiful custom login form with styled-components
  - Matching sign-up form with password confirmation
  - Improved error handling and user feedback
  - Responsive design optimized for all devices

- **New Auth Features**
  - Real-time authentication state management
  - Automatic session refresh
  - Enhanced security with Supabase Auth policies
  - Better performance with reduced bundle size

### 🔄 Changed
- **Authentication Context**: Completely rewritten to use Supabase Auth hooks
- **Middleware**: Updated to work with Supabase Auth sessions
- **User Management**: Now uses Supabase user metadata and profiles
- **Database Integration**: Enhanced integration with Supabase for user data
- **Landing Page**: Updated sign-in/sign-up buttons to use custom auth pages

### 🗑️ Removed
- **Clerk Dependencies**: Removed all Clerk-related packages and components
  - `@clerk/nextjs` package
  - `SignInButton`, `SignUpButton`, `SignedIn`, `SignedOut` components
  - `ClerkProvider` and related wrappers
  - Clerk middleware configuration

### 🔧 Technical Improvements
- **Bundle Size**: Reduced by removing Clerk dependencies
- **Performance**: Faster page loads with simplified auth state management
- **Security**: Enhanced with Supabase's built-in security features
- **Developer Experience**: Simplified authentication setup and configuration

### 📚 Documentation
- **Updated README**: Complete rewrite with Supabase Auth setup instructions
- **Migration Guide**: Added comprehensive migration documentation
- **Environment Variables**: Updated configuration guide
- **API Documentation**: Updated authentication endpoints

### 🔒 Security Enhancements
- **JWT Tokens**: Secure authentication with Supabase JWT implementation
- **Session Management**: Improved session handling with automatic refresh
- **Password Security**: Enhanced password requirements and validation
- **Data Protection**: Better user data protection with Supabase Auth policies

### 🛠️ Migration Guide

#### Environment Variables
**Old (Clerk):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

**New (Supabase):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Code Changes
**Authentication Context:**
- Replace `useUser()` from Clerk with `useAuth()` from our auth context
- Update user data access patterns for Supabase User type
- Replace Clerk components with custom authentication UI

**Database Integration:**
- User profiles now use Supabase user IDs instead of Clerk user IDs
- Enhanced user metadata handling through Supabase Auth

### 🏗️ Developer Notes
- All existing Clerk authentication flows have been replaced
- Custom authentication pages provide better control and customization
- Improved error handling and user experience
- Better integration with the existing Supabase database setup

---

## [1.5.0] - 2025-01-08

### Added
- Enhanced analytics dashboard with real-time charts
- Improved user interface with better color schemes
- Advanced filtering options for transactions
- Export functionality for financial data

### Changed
- Updated Next.js to version 15
- Improved responsive design for mobile devices
- Enhanced theme switching functionality

### Fixed
- Fixed navigation issues in dark mode
- Resolved chart rendering problems
- Improved error handling in forms

---

## [1.4.0] - 2025-01-07

### Added
- Project management functionality
- Team collaboration features
- Meeting scheduling system
- Department management

### Changed
- Improved sidebar navigation
- Enhanced user profile management
- Better organization settings

### Fixed
- Fixed memory leaks in chart components
- Resolved authentication edge cases
- Improved form validation

---

## [1.3.0] - 2025-01-06

### Added
- Investment tracking and portfolio management
- Market analysis tools
- Risk assessment features
- Transaction history improvements

### Changed
- Updated database schema for better performance
- Improved API endpoints
- Enhanced security measures

### Fixed
- Fixed data synchronization issues
- Resolved performance bottlenecks
- Improved error messaging

---

## [1.2.0] - 2025-01-05

### Added
- Advanced financial analytics
- Custom reporting features
- Data export capabilities
- Enhanced dashboard widgets

### Changed
- Improved user experience with better loading states
- Updated component library
- Enhanced theme system

### Fixed
- Fixed calculation errors in financial metrics
- Resolved UI inconsistencies
- Improved accessibility features

---

## [1.1.0] - 2025-01-04

### Added
- Invoice management system
- Payment processing features
- Budget tracking functionality
- Savings goals tracking

### Changed
- Updated UI components with shadcn/ui
- Improved navigation structure
- Enhanced mobile responsiveness

### Fixed
- Fixed form submission issues
- Resolved styling conflicts
- Improved data validation

---

## [1.0.0] - 2025-01-12

### Added
- Complete financial management system with dashboard
- User authentication and profile management
- Organization and team management
- Project tracking and collaboration
- Invoice and payment processing
- Investment portfolio management
- Real-time chat system
- Advanced analytics and reporting
- Responsive design for all devices
- Dark/light theme support

### Technical Features
- Next.js 15 with App Router
- Supabase database integration
- Clerk authentication
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/ui component library
- Real-time subscriptions
- File upload capabilities

### Database
- Comprehensive schema with 20+ tables
- Row Level Security (RLS) policies
- Automated migrations
- Audit logging system
- Custom role management

### Security
- Row Level Security enabled
- Authentication required for sensitive operations
- Audit trail for all data changes
- Secure file upload handling

### Performance
- Optimized database queries
- Efficient data loading
- Responsive UI components
- Fast page transitions

---

## Migration from v1.x to v2.0

### 🔄 Automatic Migrations
- User data will be automatically migrated to the new Supabase structure
- Existing organizations and financial data remain intact
- User preferences and settings are preserved

### ⚠️ Manual Steps Required
1. **Update Environment Variables**: Replace Clerk variables with Supabase configuration
2. **User Re-authentication**: All users will need to sign in again with their existing credentials
3. **Custom Integrations**: Update any custom authentication integrations to use Supabase Auth

### 📞 Support
For migration assistance or questions, please:
- Check the updated documentation in the `docs/` directory
- Open an issue on GitHub for technical support
- Refer to the Supabase Auth documentation for advanced configurations

---

**Note**: This changelog follows semantic versioning. Major version increments (like 2.0.0) indicate breaking changes that may require migration steps. 