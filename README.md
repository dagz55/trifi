# TriFi - Advanced Financial Management Platform

A modern, feature-rich financial management platform built with Next.js, TypeScript, and Supabase. Designed for businesses of all sizes with enterprise-grade features and security.

## 🚀 Features

### Authentication & Security
- **Supabase Authentication** - Secure email/password authentication with session management
- **Role-Based Access Control** - Granular permissions for different user types
- **Multi-Organization Support** - Users can belong to multiple organizations with different roles
- **Bank-Grade Security** - Enterprise-level encryption and security measures

### Financial Management
- **Advanced Analytics** - Real-time financial analytics with AI-powered insights
- **Payment Processing** - Secure payment handling with multiple currency support
- **Investment Tracking** - Comprehensive portfolio management with real-time market data
- **Invoice Management** - Professional invoicing with automated billing cycles
- **Budget Tracking** - Monitor expenses and set financial goals

### User Experience
- **Modern UI/UX** - Clean, intuitive interface built with Tailwind CSS and shadcn/ui
- **Enhanced Dashboard** - Optimized overview cards with proper text display and responsive sizing
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Mobile Responsive** - Optimized for all devices with offline capabilities
- **Real-time Updates** - Live data synchronization across all connected devices

### Business Tools
- **Team Collaboration** - Multi-user accounts with collaborative financial planning
- **Organization Management** - Manage company structure and departments
- **Advanced Reporting** - Comprehensive financial reports and analytics
- **API Integration** - RESTful API for third-party integrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trifi.git
cd trifi
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to the environment variables
3. Run the database migrations:

```bash
# Apply the database schema
npx supabase db push
```

Or manually run the SQL files in the `supabase/migrations/` directory in your Supabase dashboard.

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
trifi/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with auth providers
│   ├── page.tsx           # Landing/dashboard page
│   ├── sign-in/           # Authentication pages
│   └── sign-up/
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── analytics/        # Analytics dashboard components
│   ├── auth-wrapper.tsx  # Authentication wrapper
│   └── ...
├── contexts/             # React Context providers
│   ├── auth-context.tsx  # Supabase auth context
│   └── settings-context.tsx
├── lib/                  # Utility libraries
│   ├── supabase.ts      # Supabase client configuration
│   ├── auth.ts          # Authentication service
│   ├── database.ts      # Database utilities
│   └── utils.ts         # General utilities
├── supabase/            # Supabase configuration
│   ├── migrations/      # Database migrations
│   └── config.toml      # Supabase config
└── docs/                # Documentation
```

## 🔧 Configuration

### Authentication

The application uses Supabase Auth for user authentication. Users can:
- Sign up with email/password
- Sign in with existing credentials
- Reset passwords via email
- Manage profile information

### Database Schema

Key database tables:
- `user_profiles` - Extended user information
- `organizations` - Company/organization data
- `organization_members` - User-organization relationships
- Additional tables for financial data, transactions, etc.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL (for production) | No |

## 🔒 Security

- **Authentication**: Secure JWT-based authentication via Supabase
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: All sensitive data is encrypted at rest and in transit
- **Session Management**: Automatic session handling with refresh tokens
- **CORS**: Properly configured cross-origin resource sharing

## 📊 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Component Documentation](./docs/components.md)
- [Database Integration](./docs/database-integration.md)
- [Deployment Guide](./docs/deployment.md)
- [Setup Instructions](./docs/SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI analytics
- [ ] Cryptocurrency integration
- [ ] Advanced reporting dashboard
- [ ] Third-party banking APIs
- [ ] Multi-language support

## 🏗️ Recent Updates

### v2.0.0 - Supabase Migration
- **BREAKING**: Migrated from Clerk to Supabase Auth
- Enhanced security with custom authentication flows
- Improved performance and reduced bundle size
- New user management features
- Updated documentation and setup guides

---

Built with ❤️ for modern financial management
