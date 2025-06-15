# TriFi - Complete Financial Management Platform

<div align="center">
  <img src="public/trifi_logo.png" alt="TriFi Logo" width="120" height="120">
  <h3>Complete Financial Management Solution</h3>
  <p>Built with Next.js 15, TypeScript, and Tailwind CSS</p>
</div>

[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)

## 🚀 Features

### 💰 **Financial Management**
- **Multi-Account Tracking**: Real-time balance monitoring across accounts
- **Transaction Management**: Comprehensive history with advanced filtering
- **Professional Invoicing**: Itemized billing with tax calculations
- **Payment Processing**: Multiple payment methods and tracking
- **Budget & Savings Goals**: Financial planning and monitoring

### 📊 **Business Operations**
- **Project Management**: Budget tracking, progress monitoring, team assignments
- **Team Management**: Role-based access control and member profiles
- **Analytics Dashboard**: Revenue charts, expense analysis, KPI tracking
- **Organization Setup**: Company structure and department management

### 🎨 **User Experience**
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Theme switching with system preference detection
- **Real-time Updates**: Live data synchronization across components
- **Intuitive Interface**: Clean, modern design with accessibility features

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Clerk (optional, with graceful fallbacks)
- **Database**: Supabase (optional, works without database)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context with localStorage persistence

## 📦 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/dagz55/trifi.git
cd trifi
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build for Production
```bash
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables
See [.env.example](.env.example) for all available configuration options.

**Required for full functionality:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Authentication
- `CLERK_SECRET_KEY` - Authentication
- `NEXT_PUBLIC_SUPABASE_URL` - Database (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database (optional)

**Note**: The application works in demo mode without any environment variables configured.

## 📁 Project Structure

```
trifi/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui base components
│   ├── analytics/         # Analytics components
│   └── modals/           # Modal components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and database
├── docs/                  # Documentation
└── public/               # Static assets
```

## 🎯 Key Features Implementation

### ✅ Fully Functional Components
- **Project Creation**: Complete modal with form validation
- **Team Management**: Add/remove members with role assignment
- **Invoice Generation**: Professional invoices with itemized billing
- **Financial Transactions**: Full CRUD operations with categorization
- **Settings Management**: Comprehensive user preferences
- **Data Export**: CSV/PDF export functionality

### ✅ Authentication & Security
- Secure authentication via Clerk
- Protected routes and user sessions
- Role-based access control
- Data validation and sanitization

### ✅ Data Management
- Persistent state with localStorage
- Optional database integration
- Real-time data synchronization
- Graceful offline functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm start
# or deploy the .next folder to your hosting provider
```

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](docs/deployment.md) - Production deployment
- [API Documentation](docs/api.md) - API reference
- [Component Documentation](docs/components.md) - UI components
- [Database Schema](docs/database-integration.md) - Database setup

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Development Guidelines
- TypeScript strict mode enabled
- ESLint configuration with Next.js rules
- Component-first architecture
- Responsive design principles
- Accessibility best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please check:
- [Documentation](docs/)
- [GitHub Issues](https://github.com/dagz55/trifi/issues)
- [Setup Guide](docs/SETUP.md)

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>© 2025 TriFi. Open source financial management platform.</p>
</div>
