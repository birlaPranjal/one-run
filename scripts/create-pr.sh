#!/bin/bash

# Quick PR creation script
# This script creates a PR using GitHub CLI

set -e

BRANCH="feature/admin-panel-improvements"
TITLE="Add: Admin panel with CSV export and productivity improvements"
BODY="## 🚀 Features Added

### Admin Panel
- ✅ View all unique certificate entries (duplicates automatically filtered)
- ✅ Search functionality by name or distance
- ✅ Statistics dashboard (unique entries, total certificates, duplicates)
- ✅ CSV export for data analysis
- ✅ Beautiful, responsive UI matching the app design

### Code Improvements
- ✅ Enhanced error handling with better validation
- ✅ Improved error messages for debugging
- ✅ File existence checks before processing

### Developer Experience
- ✅ GitHub PR workflow automation script
- ✅ CI/CD workflow with linting and type checking
- ✅ Comprehensive CONTRIBUTING.md guide
- ✅ Updated README with admin panel documentation

## 📝 Changes
- New admin panel at \`/admin\`
- New API endpoint: \`/api/certificate/admin\`
- CSV export functionality
- Better error handling across API routes
- GitHub Actions CI workflow
- PR automation script

## 🧪 Testing
- [x] Admin panel loads and displays entries correctly
- [x] CSV export works properly
- [x] Search functionality works
- [x] Error handling improved
- [x] No linting errors"

echo "🔐 Authenticating with GitHub..."
gh auth login

echo ""
echo "📝 Creating Pull Request..."
gh pr create --title "$TITLE" --body "$BODY" --base main --head "$BRANCH"

echo ""
echo "✅ PR created! Would you like to merge it now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    PR_NUMBER=$(gh pr list --head "$BRANCH" --json number --jq '.[0].number')
    echo "🔀 Merging PR #$PR_NUMBER..."
    gh pr merge "$PR_NUMBER" --merge --delete-branch
    echo "✅ PR merged successfully!"
    git checkout main
    git pull origin main
fi

