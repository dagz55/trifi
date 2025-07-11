// Verify database schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySchema() {
    console.log('🔍 Verifying database schema...');
    
    const tables = [
        'user_profiles',
        'organizations', 
        'organization_members',
        'departments',
        'account_types',
        'accounts',
        'transaction_categories',
        'transactions',
        'projects',
        'project_members',
        'invoices',
        'invoice_items',
        'payments',
        'budget_goals',
        'meetings',
        'meeting_attendees',
        'investments',
        'notifications',
        'audit_logs',
        'custom_roles'
    ];
    
    const results = {};
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                results[table] = { exists: false, error: error.message };
            } else {
                results[table] = { exists: true, count: data };
            }
        } catch (err) {
            results[table] = { exists: false, error: err.message };
        }
    }
    
    // Print results
    console.log('\n📊 Schema Verification Results:');
    console.log('================================');
    
    let existingTables = 0;
    let missingTables = 0;
    
    for (const [table, result] of Object.entries(results)) {
        if (result.exists) {
            console.log(`✅ ${table}`);
            existingTables++;
        } else {
            console.log(`❌ ${table} - ${result.error}`);
            missingTables++;
        }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Existing tables: ${existingTables}`);
    console.log(`❌ Missing tables: ${missingTables}`);
    
    if (missingTables > 0) {
        console.log('\n🔧 Some tables are missing. You may need to:');
        console.log('1. Run the migration files manually through Supabase dashboard');
        console.log('2. Check if there are any SQL errors in the migration files');
        console.log('3. Ensure you have the correct permissions');
    } else {
        console.log('\n🎉 All tables exist! Database schema is complete.');
    }
}

verifySchema();