#!/bin/bash

# GitHub Automation Script
# Handles push, pull, and sync operations with automatic setup

set -e

# Configuration file paths
CONFIG_DIR="$HOME/.github_automation"
CONFIG_FILE="$CONFIG_DIR/config"
CREDENTIALS_FILE="$CONFIG_DIR/credentials"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"
chmod 700 "$CONFIG_DIR"

# Utility functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
}

# Load configuration
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
    fi
    
    if [[ -f "$CREDENTIALS_FILE" ]]; then
        source "$CREDENTIALS_FILE"
    fi
}

# Save configuration
save_config() {
    cat > "$CONFIG_FILE" << EOF
REPO_URL="$REPO_URL"
REPO_BRANCH="$REPO_BRANCH"
REPO_PATH="$REPO_PATH"
EOF
    chmod 600 "$CONFIG_FILE"
}

# Save credentials
save_credentials() {
    cat > "$CREDENTIALS_FILE" << EOF
GITHUB_USERNAME="$GITHUB_USERNAME"
GITHUB_TOKEN="$GITHUB_TOKEN"
EOF
    chmod 600 "$CREDENTIALS_FILE"
}

# Check if user is logged in to GitHub
check_github_auth() {
    if [[ -z "$GITHUB_USERNAME" ]] || [[ -z "$GITHUB_TOKEN" ]]; then
        return 1
    fi
    
    # Test authentication by making a simple API call
    if curl -s -f -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/user" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Prompt for GitHub credentials
setup_github_auth() {
    print_info "GitHub authentication required."
    echo
    
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    
    echo
    print_warning "For security, please use a Personal Access Token instead of your password."
    print_info "Create one at: https://github.com/settings/tokens"
    print_info "Required scopes: repo, workflow"
    echo
    
    read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
    echo
    
    # Test the credentials
    print_info "Testing authentication..."
    if curl -s -f -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/user" > /dev/null 2>&1; then
        print_success "Authentication successful!"
        save_credentials
    else
        print_error "Authentication failed. Please check your credentials."
        exit 1
    fi
}

# Check if repository is configured
check_repo_config() {
    if [[ -z "$REPO_URL" ]] || [[ -z "$REPO_BRANCH" ]] || [[ -z "$REPO_PATH" ]]; then
        return 1
    fi
    
    if [[ ! -d "$REPO_PATH/.git" ]]; then
        return 1
    fi
    
    return 0
}

# Setup repository configuration
setup_repo_config() {
    print_info "Repository configuration required."
    echo
    
    # Ask for repository URL
    read -p "Enter the GitHub repository URL (https://github.com/user/repo.git): " REPO_URL
    
    # Validate URL format
    if [[ ! "$REPO_URL" =~ ^https://github\.com/.+/.+\.git$ ]]; then
        print_error "Invalid repository URL format. Please use: https://github.com/user/repo.git"
        exit 1
    fi
    
    # Ask for branch
    read -p "Enter the branch name (default: main): " REPO_BRANCH
    REPO_BRANCH=${REPO_BRANCH:-main}
    
    # Ask for local path
    read -p "Enter the local repository path (default: ./$(basename "$REPO_URL" .git)): " REPO_PATH
    REPO_PATH=${REPO_PATH:-./$(basename "$REPO_URL" .git)}
    
    # Convert to absolute path
    REPO_PATH=$(realpath "$REPO_PATH")
    
    save_config
    
    # Clone or initialize repository
    if [[ ! -d "$REPO_PATH" ]]; then
        print_info "Cloning repository..."
        git clone "$REPO_URL" "$REPO_PATH"
        cd "$REPO_PATH"
        git checkout "$REPO_BRANCH" 2>/dev/null || git checkout -b "$REPO_BRANCH"
        print_success "Repository cloned successfully!"
    elif [[ ! -d "$REPO_PATH/.git" ]]; then
        print_info "Initializing repository..."
        cd "$REPO_PATH"
        git init
        git remote add origin "$REPO_URL"
        git checkout -b "$REPO_BRANCH"
        print_success "Repository initialized successfully!"
    else
        print_info "Using existing repository at $REPO_PATH"
    fi
}

# Configure git with user credentials
configure_git() {
    cd "$REPO_PATH"
    git config user.name "$GITHUB_USERNAME"
    git config user.email "$GITHUB_USERNAME@users.noreply.github.com"
    
    # Configure credential helper for HTTPS
    git config credential.helper store
    
    # Set up the remote URL with token
    AUTHENTICATED_URL=$(echo "$REPO_URL" | sed "s|https://|https://$GITHUB_USERNAME:$GITHUB_TOKEN@|")
    git remote set-url origin "$AUTHENTICATED_URL"
}

# Git operations
git_status() {
    cd "$REPO_PATH"
    print_info "Repository status:"
    git status --short
    echo
    git log --oneline -5
}

git_pull() {
    cd "$REPO_PATH"
    print_info "Pulling latest changes from $REPO_BRANCH..."
    
    # Fetch latest changes
    git fetch origin
    
    # Check if there are any changes to pull
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse "origin/$REPO_BRANCH")
    
    if [[ "$LOCAL" == "$REMOTE" ]]; then
        print_success "Already up to date!"
    else
        git pull origin "$REPO_BRANCH"
        print_success "Successfully pulled latest changes!"
    fi
}

git_push() {
    cd "$REPO_PATH"
    
    # Check if there are any changes to commit
    if git diff --quiet && git diff --cached --quiet; then
        print_warning "No changes to commit."
        return 0
    fi
    
    print_info "Current changes:"
    git status --short
    echo
    
    read -p "Enter commit message: " COMMIT_MSG
    
    if [[ -z "$COMMIT_MSG" ]]; then
        COMMIT_MSG="Automated commit $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    print_info "Adding changes..."
    git add -A
    
    print_info "Committing changes..."
    git commit -m "$COMMIT_MSG"
    
    print_info "Pushing to $REPO_BRANCH..."
    git push origin "$REPO_BRANCH"
    
    print_success "Successfully pushed changes!"
}

git_sync() {
    print_info "Syncing repository..."
    git_pull
    git_push
    print_success "Repository synchronized!"
}

# Main menu
show_menu() {
    echo
    print_info "GitHub Automation Script"
    echo "========================="
    echo "1. Pull (fetch latest changes)"
    echo "2. Push (commit and push changes)"
    echo "3. Sync (pull then push)"
    echo "4. Status (show repository status)"
    echo "5. Reconfigure repository"
    echo "6. Reconfigure authentication"
    echo "7. Exit"
    echo
}

# Main execution
main() {
    check_git
    load_config
    
    # Check authentication
    if ! check_github_auth; then
        setup_github_auth
    else
        print_success "GitHub authentication verified!"
    fi
    
    # Check repository configuration
    if ! check_repo_config; then
        setup_repo_config
    else
        print_success "Repository configuration loaded!"
    fi
    
    # Configure git
    configure_git
    
    # Interactive menu
    while true; do
        show_menu
        read -p "Select an option (1-7): " choice
        
        case $choice in
            1)
                git_pull
                ;;
            2)
                git_push
                ;;
            3)
                git_sync
                ;;
            4)
                git_status
                ;;
            5)
                setup_repo_config
                configure_git
                ;;
            6)
                setup_github_auth
                configure_git
                ;;
            7)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-7."
                ;;
        esac
        
        echo
        read -p "Press Enter to continue..."
    done
}

# Run the script
main