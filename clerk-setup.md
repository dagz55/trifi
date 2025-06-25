# Clerk Authentication Setup Guide

## Step 1: Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your authentication methods (email, social logins, etc.)

## Step 2: Environment Variables
Add these to your `.env.local` file:

```bash
# Clerk Authentication - Get these from your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs (these can stay as-is for most setups)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Existing Supabase Configuration
SUPABASE_URL=https://azahdzcejfzyqpuffczq.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Get Your Keys
1. In your Clerk dashboard, go to **Developers** → **API Keys**
2. Copy the **Publishable key** and **Secret key**
3. Replace the values in your `.env.local` file

## Step 4: Configure Authentication Pages
The app will automatically create sign-in and sign-up pages at:
- `/sign-in`
- `/sign-up`

## Step 5: Test Authentication
1. Start your development server: `npm run dev`
2. Navigate to any protected page
3. You should be redirected to sign-in
4. Create an account or sign in

## Features Included
- ✅ Email/password authentication
- ✅ Social logins (configurable in Clerk dashboard)
- ✅ User profile management
- ✅ Session management
- ✅ Protected routes
- ✅ User organization management 