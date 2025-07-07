# TriFi - Next-Generation Financial Management Platform

🚀 **State-of-the-Art Financial Intelligence Platform** - Built with cutting-edge design and advanced technology stack

TriFi is a revolutionary financial management platform that combines sophisticated design with powerful functionality. Built with Next.js, TypeScript, and modern web technologies, it delivers an unparalleled user experience that stands above traditional financial applications.

## ✨ What Makes TriFi Different

### 🎨 **Modern Visual Design**
- **Particle Animation System**: Interactive canvas-based animations that respond to user movement
- **Glass Morphism Interface**: Sophisticated backdrop blur effects and transparent overlays
- **Advanced Gradient System**: Ocean, sunset, forest, aurora, fire, and cosmic color themes
- **Smooth Micro-Interactions**: Premium animations powered by Framer Motion
- **Neon Glow Effects**: Professional lighting effects for enhanced visual appeal

### 🚀 **Cutting-Edge Technology**
- **Interactive Financial Charts**: Real-time animated SVG charts with gradient fills
- **AI-Powered Analytics**: Machine learning-driven insights and predictive analytics
- **Real-Time Data Visualization**: Live updating dashboards with smooth transitions
- **Advanced Animation Framework**: 60fps performance with optimized rendering
- **Philippine-First Design**: Built specifically for Filipino businesses with peso support

## Latest Design Revolution (January 2025)

### 🎯 **Revolutionary User Experience**
- **Premium Theme Toggle**: Revolutionary dark/light mode toggle created with MCP servers
  - Navigation variant: Compact design with ripple effects for headers and navigation bars
  - Standalone variant: Full-featured toggle with sliding animations and ambient glow effects
  - Enterprise-grade security indicators and accessibility features
  - Interactive ripple effects and spring animations with Framer Motion
- **Animated Hero Section**: Particle effects, floating elements, and interactive financial data
- **Dynamic Feature Showcase**: Interactive component selection with detailed explanations
- **Premium Pricing Cards**: Motion-enhanced cards with sophisticated animations
- **Enhanced Theme System**: Improved dark mode with better contrast and visual hierarchy
- **Modern Gradient Buttons**: Multiple variants with glow effects and smooth transitions

### 🌟 **Professional Aesthetics**
- **Enterprise-Grade Design**: Suitable for serious financial applications
- **Brand Differentiation**: Unique visual identity that showcases technology leadership
- **Glass Morphism Elements**: Modern UI patterns with backdrop blur and transparency
- **Sophisticated Color Palette**: Extended gradient system with responsive variants
- **Typography Excellence**: Advanced text effects with gradient and shimmer animations

## Features

### 💰 Financial Management
- **Accounts Overview**: Multi-account balance tracking with real-time updates
- **Transaction Management**: Comprehensive transaction tracking with advanced filtering
- **Invoicing System**: Professional invoice creation, tracking, and management
- **Payment Processing**: Payment method management and transaction history
- **Budget Tracking**: Budget creation and expense monitoring
- **Savings Goals**: Goal setting and progress tracking

### 📊 Analytics & Reporting
- **Financial Analytics**: Revenue charts, expense analysis, and trend visualization
- **Account Growth Tracking**: Historical account performance and growth metrics
- **Custom Reports**: Exportable reports with date range filtering
- **Business Metrics**: KPI tracking and performance indicators
- **Real-time Dashboards**: Live data visualization with interactive charts

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **Advanced Theme System**: Premium dark/light mode toggle with MCP server integration
  - Available in navigation bar on all pages
  - Demo page at `/theme-toggle-demo` showcasing both variants
- **Dark/Light Mode**: Theme switching with system preference detection
- **Real-time Updates**: Live data synchronization across components
- **Intuitive Interface**: Clean, modern design with accessibility features
- **Enhanced Card Design**: Improved card contrast with clear black/white text
- **Interactive Elements**: Green hover effects for better user feedback
- **Accessibility Focus**: High contrast ratios and clear visual hierarchy
- **Consistent Navigation Color**: Dashboard menu text color remains the same in dark and light modes

### 🏢 Business Management
- **Organization Setup**: Company profile and structure management
- **Department Management**: Team organization and budget allocation
- **Project Tracking**: Project lifecycle management with progress monitoring
- **Team Members**: User management with role-based permissions
- **Meeting Scheduler**: Calendar integration and meeting management

### 💼 Investment Tools
- **Portfolio Overview**: Investment tracking and performance analysis
- **Market Analysis**: Real-time market data and trends
- **Risk Assessment**: Investment risk evaluation tools
- **Transaction History**: Detailed investment transaction logs
- **Performance Metrics**: ROI calculation and portfolio analytics

### ⚙️ Advanced Settings
- **User Preferences**: Customizable dashboard and UI settings
- **Security Settings**: Password rules, 2FA, and security monitoring
- **Notification Management**: Granular notification preferences
- **Privacy Controls**: Data sharing and visibility settings
- **Unsaved Changes Protection**: Automatic change detection with save prompts

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion

### **Backend & Database**
- **Authentication**: Clerk for user management
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API routes with tRPC (ready)
- **File Storage**: Supabase Storage

### **Development Tools**
- **Package Manager**: npm/pnpm
- **Linting**: ESLint with TypeScript rules
- **Code Formatting**: Prettier
- **Git Hooks**: Husky for pre-commit checks

## 📁 Project Structure

```
trifi/
├── app/                          # Next.js App Router pages
│   ├── analytics/               # Analytics dashboard
│   ├── chat/                    # Team communication
│   ├── help/                    # Support and documentation
│   ├── invoices/               # Invoice management
│   ├── meetings/               # Meeting scheduling
│   ├── members/                # Team member management
│   ├── organization/           # Company settings
│   ├── payments/               # Payment processing
│   ├── permissions/            # Access control
│   ├── projects/               # Project management
│   ├── settings/               # User preferences
│   ├── transactions/           # Transaction history
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Dashboard page
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components
│   ├── analytics/              # Analytics-specific components
│   ├── investor/               # Investor-related components
│   └── *.tsx                   # Feature components
├── contexts/                    # React Context providers
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── public/                      # Static assets
├── styles/                      # Global styles
└── types/                       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/trifi.git
   cd trifi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Database
   DATABASE_URL=your_database_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### **Dashboard Overview**
The main dashboard provides a comprehensive view of your financial status:
- Account balances across multiple accounts
- Recent transaction history
- Quick actions (Add money, Send money, Pay bills)
- Business metrics and KPIs

### **Transaction Management**
1. Navigate to **Transactions** in the sidebar
2. View all transactions with advanced filtering options
3. Add new transactions using the "Add Transaction" button
4. Export transaction data for external analysis
5. Use advanced filters for detailed transaction analysis

### **Invoice Management**
1. Access **Invoices** from the sidebar
2. Create professional invoices with itemized billing
3. Track invoice status (Draft, Sent, Paid, Overdue)
4. Manage client information and payment terms
5. Export invoices as PDF or CSV

### **Analytics & Reporting**
1. Visit the **Analytics** section
2. View revenue charts and expense breakdowns
3. Monitor account growth over time
4. Generate custom reports with date range selection
5. Export analytics data for further analysis

### **Team & Organization Management**
1. Configure your organization in **Organization** settings
2. Add team members through **Members** section
3. Create and manage projects in **Projects**
4. Schedule meetings using the **Meetings** feature
5. Set up departments and assign budgets

### **Investment Tracking**
1. Access **Investor** tools from the sidebar
2. Monitor portfolio performance and asset allocation
3. Track investment transactions and fees
4. Analyze market trends and opportunities
5. Assess investment risks and returns

## 🔧 Configuration

### **Theme Configuration**
The app supports dark/light mode switching:
```tsx
// In components/theme-provider.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
>>>>>>> 9c56260 (Add Clerk auth pages)
```

### **Settings Management**
Global settings are managed through React Context:
```tsx
// Usage in components
import { useSettings } from "@/contexts/settings-context"

<<<<<<< HEAD
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
||||||| parent of 9c56260 (Add Clerk auth pages)
### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (if using)
DATABASE_URL="your_database_url"

# Authentication (if implementing)
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (if needed)
NEXT_PUBLIC_API_URL="your_api_url"
=======
const { settings, updateSettings } = useSettings()
>>>>>>> 9c56260 (Add Clerk auth pages)
```

<<<<<<< HEAD
## 🎯 Key Features Implementation
||||||| parent of 9c56260 (Add Clerk auth pages)
### Customization
=======
### **Unsaved Changes Protection**
Forms automatically detect unsaved changes:
```tsx
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar"
>>>>>>> 9c56260 (Add Clerk auth pages)

<<<<<<< HEAD
### ✅ Fully Functional Components
- **Project Creation**: Complete modal with form validation
- **Team Management**: Add/remove members with role assignment
- **Invoice Generation**: Professional invoices with itemized billing
- **Financial Transactions**: Full CRUD operations with categorization
- **Settings Management**: Comprehensive user preferences
- **Data Export**: CSV/PDF export functionality
||||||| parent of 9c56260 (Add Clerk auth pages)
#### Currency and Localization
- Currency settings in `contexts/settings-context.tsx`
- Default locale configuration in `app/layout.tsx`
- Regional formatting in utility functions
=======
const { hasUnsavedChanges, isSaving, handleSave, handleReset } = useUnsavedChanges({
  initialData,
  currentData,
  onSave: async (data) => await saveData(data),
  onReset: () => resetForm(),
})
```
>>>>>>> 9c56260 (Add Clerk auth pages)

<<<<<<< HEAD
### ✅ Authentication & Security
- Secure authentication via Clerk
- Protected routes and user sessions
- Role-based access control
- Data validation and sanitization
||||||| parent of 9c56260 (Add Clerk auth pages)
#### Theming
- Color schemes in `tailwind.config.js`
- Component styles in `components/ui/`
- Global styles in `app/globals.css`
=======
## 🎨 UI Components
>>>>>>> 9c56260 (Add Clerk auth pages)

<<<<<<< HEAD
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
||||||| parent of 9c56260 (Add Clerk auth pages)
## 🔧 Development
=======
### **Design System**
- **Colors**: Tailwind CSS color palette with dark mode support
- **Typography**: System fonts with customizable sizes
- **Spacing**: Consistent spacing scale using Tailwind
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icon set
>>>>>>> 9c56260 (Add Clerk auth pages)

<<<<<<< HEAD
### Available Scripts
||||||| parent of 9c56260 (Add Clerk auth pages)
### Available Scripts

=======
### **Responsive Design**
- Mobile-first approach with responsive breakpoints
- Adaptive sidebar navigation
- Touch-friendly interface elements
- Optimized layouts for all screen sizes

### **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 🔐 Security Features

### **Authentication**
- Secure user authentication via Clerk
- Multi-factor authentication support
- Session management and security monitoring
- Password strength requirements

### **Data Protection**
- Encrypted data transmission (HTTPS)
- Secure API endpoints
- Input validation and sanitization
- CSRF protection

### **Privacy Controls**
- Granular privacy settings
- Data export capabilities
- Account deletion options
- Audit trail logging

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Docker**
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Variables for Production**
Ensure all environment variables are properly configured for production deployment.

## 🧪 Testing

### **Running Tests**
>>>>>>> 9c56260 (Add Clerk auth pages)
```bash
<<<<<<< HEAD
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
||||||| parent of 9c56260 (Add Clerk auth pages)
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
=======
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
>>>>>>> 9c56260 (Add Clerk auth pages)
```

<<<<<<< HEAD
### Development Guidelines
- TypeScript strict mode enabled
- ESLint configuration with Next.js rules
- Component-first architecture
- Responsive design principles
- Accessibility best practices
||||||| parent of 9c56260 (Add Clerk auth pages)
### Code Style

- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Code formatting (configure as needed)
- **TypeScript**: Strict mode enabled
- **File Naming**: kebab-case for files, PascalCase for components
=======
### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

>>>>>>> 9c56260 (Add Clerk auth pages)
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

<<<<<<< HEAD
For support, please check:
- [Documentation](docs/)
- [GitHub Issues](https://github.com/dagz55/trifi/issues)
- [Setup Guide](docs/SETUP.md)
||||||| parent of 9c56260 (Add Clerk auth pages)
- **Documentation**: [https://docs.trifi.ph](https://docs.trifi.ph)
- **Community**: [https://community.trifi.ph](https://community.trifi.ph)
- **Email**: support@trifi.ph
- **Phone**: +63 2 8123 4567

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Lucide](https://lucide.dev/) for beautiful icons
- The open-source community for continuous inspiration
=======
### **Documentation**
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### **Community**
- GitHub Issues for bug reports
- GitHub Discussions for feature requests
- Discord community for real-time support

### **Professional Support**
For enterprise support and custom development, contact our team.
>>>>>>> 9c56260 (Add Clerk auth pages)

---

<<<<<<< HEAD
<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>© 2025 TriFi. Open source financial management platform.</p>
</div>
||||||| parent of 9c56260 (Add Clerk auth pages)
<div align="center">
  <p>Built with ❤️ for Philippine businesses</p>
  <p>© 2024 TriFi Corporation. All rights reserved.</p>
</div>
=======
**Built with ❤️ by the TriFi Team**

*Empowering financial management through modern technology*
>>>>>>> 9c56260 (Add Clerk auth pages)

> **2025-07-06 Update**
> 
> • Added a black-and-white favicon (SVG) and linked it in the global metadata to eliminate 404 errors for `/favicon.ico`.
> • Chat module now renders in strict black & white thanks to a Tailwind `grayscale` filter. No functional changes.
> • Sidebar navigation now renders plain black text (active item bold with grey highlight).
> • Pricing cards on landing page now display feature lists and button borders correctly in both themes.
