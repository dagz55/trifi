// Test database connection and run initial migration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    try {
        console.log('Testing database connection...');
        
        // Test basic query
        const { data, error } = await supabase
            .from('user_profiles')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.log('Table does not exist yet, this is expected for new database');
            console.log('Error:', error.message);
            return false;
        }
        
        console.log('✅ Database connection successful');
        console.log('✅ Tables already exist');
        return true;
        
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        return false;
    }
}

async function createInitialSchema() {
    try {
        console.log('Creating initial schema...');
        
        // Enable UUID extension first
        const { error: uuidError } = await supabase.rpc('sql', {
            query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        });
        
        if (uuidError) {
            console.log('UUID extension may already exist or needs to be created manually');
        }
        
        // Create user_profiles table
        const { error: userProfilesError } = await supabase.rpc('sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.user_profiles (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    clerk_user_id TEXT UNIQUE NOT NULL,
                    full_name TEXT,
                    email TEXT,
                    phone TEXT,
                    avatar_url TEXT,
                    timezone TEXT DEFAULT 'UTC+8',
                    language TEXT DEFAULT 'en',
                    currency TEXT DEFAULT 'PHP',
                    date_format TEXT DEFAULT 'mm-dd-yyyy',
                    theme TEXT DEFAULT 'system',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        
        if (userProfilesError) {
            console.error('Error creating user_profiles table:', userProfilesError);
            return false;
        }
        
        console.log('✅ Initial schema created successfully');
        return true;
        
    } catch (err) {
        console.error('❌ Schema creation failed:', err.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting database setup...');
    console.log('Database URL:', supabaseUrl);
    
    const isConnected = await testConnection();
    
    if (!isConnected) {
        console.log('📦 Setting up initial schema...');
        const schemaCreated = await createInitialSchema();
        
        if (schemaCreated) {
            console.log('✅ Database setup completed successfully');
            console.log('You can now run the full migration manually or use Supabase dashboard');
        } else {
            console.log('❌ Database setup failed');
            process.exit(1);
        }
    } else {
        console.log('✅ Database is already set up');
    }
}

main();