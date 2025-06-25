# Settings Page Documentation

## Overview

The TriFi settings page provides comprehensive user account management with five main sections: Account, Security, Preferences, Notifications, and Privacy. The page includes advanced features like unsaved changes detection, form validation, and responsive design.

## Features

### 1. Account Settings
- **Profile Management**: Upload and manage profile pictures
- **Personal Information**: Full name, email, phone number
- **Timezone Configuration**: Support for global timezones
- **Avatar Selection**: Choose from default avatars or upload custom images

### 2. Security Settings
- **Password Management**: Change password with confirmation
- **Two-Factor Authentication**: Enable/disable 2FA
- **Login History**: View recent login activities with device and location info
- **Active Sessions**: Manage currently active sessions across devices
- **Session Management**: Terminate individual sessions or all other sessions

### 3. Preferences
- **Language & Region**: 
  - Language selection (English, Spanish, French, Filipino)
  - Currency settings (PHP, USD, EUR, GBP)
  - Date format preferences (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- **Appearance**:
  - Theme selection (Light, Dark, System)
  - Font size adjustment (12px - 24px)

### 4. Notification Settings
- **Notification Channels**:
  - Email notifications
  - Push notifications
  - SMS notifications
- **Notification Types**:
  - Account activity alerts
  - New features and updates
  - Marketing and promotions
- **Frequency Control**: Real-time, daily digest, or weekly summary

### 5. Privacy Settings
- **Data Sharing**:
  - Analytics data sharing toggle
  - Personalized ads preferences
- **Account Visibility**: Public or private profile settings
- **Data Retention**: Choose how long to keep your data (6 months to indefinite)
- **Data Actions**:
  - Download your data
  - Delete account

## Technical Implementation

### Authentication Wrapper
The settings page uses the `AuthWrapper` component to handle authentication states:
- **Loading State**: Shows spinner while initializing
- **Unauthenticated**: Redirects to sign-in with user-friendly interface
- **Authentication Error**: Graceful fallback with setup instructions
- **Development Mode**: Allows demo access when Clerk is not configured

### Unsaved Changes Detection
Implements comprehensive change tracking:
- **Deep Object Comparison**: Detects nested changes in form data
- **Visual Indicators**: Shows amber notification bar with save/reset options
- **Browser Warning**: Prevents accidental page navigation with unsaved changes
- **Auto-save Integration**: Optional auto-save functionality

### Form Management
- **Controlled Components**: All inputs use React state for real-time updates
- **Validation**: Form validation with error handling
- **Loading States**: Visual feedback during save operations
- **Success/Error Messages**: Toast notifications for user feedback

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Grid Layouts**: Adaptive layouts for different sections
- **Card-Based UI**: Clean, organized interface with shadcn/ui components
- **Accessibility**: Full keyboard navigation and screen reader support

## API Integration

### Save Operations
Each settings section has dedicated save handlers:

```typescript
const handleSaveAccount = async () => {
  setIsLoading(true)
  try {
    // API call to save account settings
    await saveAccountSettings(accountForm)
    toast.success("Account settings saved successfully")
  } catch (error) {
    toast.error("Failed to save account settings")
  } finally {
    setIsLoading(false)
  }
}
```

### Data Structure
Settings data is organized into logical groups:

```typescript
interface SettingsData {
  account: {
    fullName: string
    email: string
    phone: string
    timezone: string
    avatar: string
  }
  preferences: {
    language: string
    currency: string
    dateFormat: string
    theme: string
    fontSize: number
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    accountActivity: boolean
    newFeatures: boolean
    marketing: boolean
    frequency: "real-time" | "daily" | "weekly"
  }
  privacy: {
    analyticsSharing: boolean
    personalizedAds: boolean
    visibility: "public" | "private"
    dataRetention: "6-months" | "1-year" | "2-years" | "indefinite"
  }
}
```

## Usage Examples

### Basic Implementation
```tsx
import { SettingsPage } from '@/app/settings/page'

export default function Settings() {
  return <SettingsPage />
}
```

### With Custom Authentication
```tsx
import { AuthWrapper } from '@/components/auth-wrapper'
import { SettingsContent } from '@/components/settings-content'

export default function Settings() {
  return (
    <AuthWrapper fallback={<CustomAuthFallback />}>
      <SettingsContent />
    </AuthWrapper>
  )
}
```

### Custom Unsaved Changes Hook
```tsx
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'

function MyForm() {
  const [formData, setFormData] = useState(initialData)
  
  const { hasUnsavedChanges, handleSave, handleReset } = useUnsavedChanges({
    initialData,
    currentData: formData,
    onSave: async (data) => {
      await saveToAPI(data)
    },
    onReset: () => {
      setFormData(initialData)
    }
  })

  return (
    <div>
      {/* Form components */}
      <UnsavedChangesBar 
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  )
}
```

## Customization

### Theming
The settings page supports full theming through CSS variables:
- Light/Dark mode toggle
- Custom color schemes
- Typography scaling
- Component spacing

### Extending Functionality
- Add new settings sections by extending the tabs
- Integrate with backend APIs for real-time sync
- Add custom validation rules
- Implement auto-save with debouncing

## Troubleshooting

### Common Issues

1. **404 Error on Settings Page**
   - Check if Clerk authentication is properly configured
   - Verify middleware settings
   - Ensure all dependencies are installed

2. **Unsaved Changes Not Detected**
   - Verify form data structure matches initial data
   - Check if deep comparison is working correctly
   - Ensure state updates are triggering re-renders

3. **Authentication Errors**
   - Check Clerk environment variables
   - Verify middleware configuration
   - Use AuthWrapper fallback for development

### Performance Optimization
- Implement debounced form updates for large forms
- Use React.memo for expensive components
- Lazy load heavy sections
- Optimize image uploads with compression

## Security Considerations

- All sensitive operations require authentication
- Form data is validated on both client and server
- Password changes require current password verification
- Session management includes proper token handling
- Data export includes privacy compliance features 