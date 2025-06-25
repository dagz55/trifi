# TriFi Database Configuration

## Database Connection Setup

TriFi uses Supabase as the database backend. To ensure proper functionality, you need to configure your database connection.

### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Clerk Authentication (if using Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

## How to Get Your Supabase API Keys

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select your existing "TriFi" project
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: This should look like `https://your-project-id.supabase.co`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Example .env.local file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjQyODcyNCwiZXhwIjoxOTU4MDA0NzI0fQ.example_key_here
```

## Database Connection Status

The TriFi dashboard includes a **Database Connection Status** component that:

- ✅ **Automatically checks** your database connection when you load the dashboard
- 🔄 **Shows real-time status** with visual indicators
- 🛠️ **Provides setup instructions** if connection fails
- 🔄 **Allows manual retry** of connection testing

### Connection Status Indicators:

- **🟢 Connected**: Database is properly configured and accessible
- **🔴 Disconnected**: Missing environment variables or connection failed
- **🔵 Checking**: Currently testing the connection

## Troubleshooting

### Problem: "Missing Supabase environment variables" error

**Solution**: 
1. Ensure you have a `.env.local` file in your project root
2. Verify the environment variable names are correct:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart your development server after adding the variables

### Problem: Connection fails even with correct variables

**Possible causes:**
1. **Invalid URL format**: Make sure your URL starts with `https://` and ends with `.supabase.co`
2. **Invalid API key**: Double-check you copied the anon key correctly from Supabase
3. **Project not active**: Ensure your Supabase project is active and not paused

### Problem: Limited permissions error

**This is normal**: If you see "limited permissions" in the connection status, this is expected behavior for the anonymous key and indicates a successful connection.

## Development Server Setup

After configuring your environment variables:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to access the application. The Database Connection Status will be visible on your dashboard.

## Testing Your Setup

You can manually test your database connection in two ways:

1. **Via Dashboard**: Check the Database Connection Status card on your dashboard
2. **Via API**: Visit `/api/test-db-connection` in your browser to see the raw connection test results

## Security Notes

- ⚠️ **Never commit** your `.env.local` file to version control
- 🔐 The **anon key** is safe to use in client-side code (it's public)
- 🛡️ For server-side operations requiring elevated permissions, use a service role key
- 🔄 Consider **row-level security (RLS)** policies in Supabase for data protection

## Next Steps

Once your database connection is working:

1. Set up your database schema in Supabase
2. Configure Row Level Security (RLS) policies
3. Create tables for your financial data
4. Set up real-time subscriptions if needed

For more information, see the [Supabase documentation](https://supabase.com/docs). 