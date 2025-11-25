#!/bin/bash

# GitHub PR Workflow Script
# This script automates the process of creating and merging PRs via CLI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BRANCH_NAME="${1:-feature/improvements}"
PR_TITLE="${2:-Add admin panel and productivity features}"
PR_BODY="${3:-This PR adds:
- Admin panel to view unique certificate entries
- CSV export functionality
- Improved error handling
- Updated documentation
- Better user experience}"

echo -e "${BLUE}🚀 Starting PR Workflow${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi

# Check if we're authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with GitHub${NC}"
    echo "Running: gh auth login"
    gh auth login
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo "Please commit or stash them before running this script"
    exit 1
fi

# Create new branch if not already on it
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    echo -e "${BLUE}🌿 Creating branch: ${BRANCH_NAME}${NC}"
    git checkout -b "$BRANCH_NAME"
else
    echo -e "${GREEN}✓ Already on branch: ${BRANCH_NAME}${NC}"
fi

# Get remote URL
REMOTE_URL=$(git remote get-url origin)
echo -e "${BLUE}🔗 Remote: ${REMOTE_URL}${NC}"

# Extract repo owner and name
if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
    REPO_OWNER="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]%.git}"
    echo -e "${GREEN}✓ Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
else
    echo -e "${RED}❌ Could not parse repository from remote URL${NC}"
    exit 1
fi

# Function to create PR
create_pr() {
    echo ""
    echo -e "${BLUE}📝 Creating Pull Request...${NC}"
    echo -e "Title: ${PR_TITLE}"
    echo -e "Body: ${PR_BODY}"
    echo ""
    
    # Push branch if not already pushed
    if ! git ls-remote --heads origin "$BRANCH_NAME" | grep -q "$BRANCH_NAME"; then
        echo -e "${BLUE}📤 Pushing branch to origin...${NC}"
        git push -u origin "$BRANCH_NAME"
    else
        echo -e "${GREEN}✓ Branch already exists on remote${NC}"
    fi
    
    # Create PR
    PR_URL=$(gh pr create \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --base main \
        --head "$BRANCH_NAME" \
        2>&1)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PR created successfully!${NC}"
        echo -e "${GREEN}🔗 ${PR_URL}${NC}"
        echo "$PR_URL" > .pr_url.txt
        return 0
    else
        # Check if PR already exists
        if echo "$PR_URL" | grep -q "already exists"; then
            echo -e "${YELLOW}⚠️  PR already exists${NC}"
            PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number --jq '.[0].number')
            PR_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${PR_NUMBER}"
            echo -e "${GREEN}🔗 ${PR_URL}${NC}"
            echo "$PR_URL" > .pr_url.txt
            return 0
        else
            echo -e "${RED}❌ Failed to create PR${NC}"
            echo "$PR_URL"
            return 1
        fi
    fi
}

# Function to merge PR
merge_pr() {
    if [ ! -f .pr_url.txt ]; then
        echo -e "${RED}❌ PR URL not found. Please create PR first.${NC}"
        return 1
    fi
    
    PR_URL=$(cat .pr_url.txt)
    PR_NUMBER=$(echo "$PR_URL" | grep -oE '/pull/[0-9]+' | grep -oE '[0-9]+')
    
    if [ -z "$PR_NUMBER" ]; then
        echo -e "${RED}❌ Could not extract PR number${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}🔀 Merging PR #${PR_NUMBER}...${NC}"
    
    # Merge PR
    if gh pr merge "$PR_NUMBER" --merge --delete-branch; then
        echo -e "${GREEN}✅ PR merged successfully!${NC}"
        
        # Switch back to main and pull
        echo -e "${BLUE}🔄 Switching to main branch...${NC}"
        git checkout main
        git pull origin main
        
        # Clean up
        rm -f .pr_url.txt
        echo -e "${GREEN}✅ Workflow completed!${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to merge PR${NC}"
        return 1
    fi
}

# Main menu
echo ""
echo -e "${BLUE}What would you like to do?${NC}"
echo "1) Create PR only"
echo "2) Create and merge PR"
echo "3) Merge existing PR"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        create_pr
        ;;
    2)
        if create_pr; then
            echo ""
            read -p "Merge PR now? (y/n): " merge_choice
            if [ "$merge_choice" = "y" ] || [ "$merge_choice" = "Y" ]; then
                merge_pr
            else
                echo -e "${YELLOW}⚠️  PR created but not merged${NC}"
            fi
        fi
        ;;
    3)
        merge_pr
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

