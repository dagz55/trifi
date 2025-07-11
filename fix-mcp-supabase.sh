#!/bin/bash

echo "🔧 MCP Supabase Troubleshooting & Fix Script"
echo "============================================"

# Step 1: Check if .env.local exists
echo "📁 Step 1: Checking .env.local file..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found in current directory"
    echo "📍 Current directory: $(pwd)"
    echo "🛠️  Please create .env.local file with:"
    echo "   SUPABASE_ACCESS_TOKEN=your_token_here"
    echo "   SUPABASE_URL=your_supabase_url_here"
    exit 1
else
    echo "✅ .env.local file found"
fi

# Step 2: Check if SUPABASE_ACCESS_TOKEN is in the file
echo "🔑 Step 2: Checking for SUPABASE_ACCESS_TOKEN..."
if ! grep -q "SUPABASE_ACCESS_TOKEN" .env.local; then
    echo "❌ SUPABASE_ACCESS_TOKEN not found in .env.local"
    echo "🛠️  Please add: SUPABASE_ACCESS_TOKEN=your_token_here"
    exit 1
else
    echo "✅ SUPABASE_ACCESS_TOKEN found in .env.local"
fi

# Step 3: Load environment variables
echo "📥 Step 3: Loading environment variables..."
set -a  # automatically export all variables
source .env.local
set +a

# Step 4: Validate the token is loaded
echo "🔍 Step 4: Validating loaded environment..."
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN is empty after loading"
    echo "🛠️  Check .env.local format - ensure no spaces around = and no extra quotes"
    exit 1
else
    echo "✅ SUPABASE_ACCESS_TOKEN loaded successfully (${#SUPABASE_ACCESS_TOKEN} characters)"
fi

# Step 5: Test Supabase connection
echo "🌐 Step 5: Testing Supabase connection..."
if [ -n "$SUPABASE_URL" ]; then
    echo "📡 Testing connection to: $SUPABASE_URL"
    if command -v curl >/dev/null 2>&1; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ACCESS_TOKEN")
        if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "401" ]; then
            echo "✅ Supabase endpoint is reachable"
        else
            echo "⚠️  Supabase endpoint returned status: $HTTP_STATUS"
        fi
    else
        echo "ℹ️  curl not available, skipping connection test"
    fi
else
    echo "⚠️  SUPABASE_URL not set, skipping connection test"
fi

# Step 6: Start MCP server with explicit parameters
echo "🚀 Step 6: Starting MCP server..."
echo "🔧 Using command: npx -y @modelcontextprotocol/server-supabase --access-token [TOKEN]"

# Export environment variables for the subprocess
export SUPABASE_ACCESS_TOKEN
export SUPABASE_URL

# Start the MCP server
exec npx -y @modelcontextprotocol/server-supabase --access-token "$SUPABASE_ACCESS_TOKEN"