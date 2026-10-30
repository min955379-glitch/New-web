#!/bin/bash
# Culinaire Lens - Push to GitHub Script

echo "=============================================="
echo " Culinaire Lens - Git & GitHub Deployment"
echo "=============================================="
echo ""

if [ -z "$1" ]; then
  echo "Usage:"
  echo "  1) If you already created a GitHub repo:"
  echo "     ./push_to_github.sh https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git"
  echo ""
  echo "  2) Or using GitHub Personal Access Token (PAT):"
  echo "     GITHUB_TOKEN=ghp_xxx ./push_to_github.sh <YOUR_USERNAME> <REPO_NAME>"
  echo ""
  exit 1
fi

if [[ "$1" == http* ]] || [[ "$1" == git@* ]]; then
  REMOTE_URL="$1"
  echo "Adding remote origin: $REMOTE_URL"
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  git branch -M main
  echo "Pushing code to main branch..."
  git push -u origin main
  echo "Successfully pushed to $REMOTE_URL!"
elif [ -n "$GITHUB_TOKEN" ] && [ -n "$2" ]; then
  USERNAME="$1"
  REPO_NAME="$2"
  echo "Creating GitHub repository: $USERNAME/$REPO_NAME using GitHub API..."
  
  CREATE_RES=$(curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$REPO_NAME\",\"private\":false,\"description\":\"Virtual Food Photographer for restaurant menus\"}")
  
  REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  git branch -M main
  git push -u origin main
  echo "Repository created and pushed successfully to https://github.com/${USERNAME}/${REPO_NAME}"
fi
