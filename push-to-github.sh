#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# GitHub repository URL
REPO_URL="https://github.com/JulesSitpach/tradenavigator-clean.git"

echo -e "${BLUE}=== TradeNavigator GitHub Push Script ===${NC}"
echo -e "${YELLOW}This script will push your code to: ${REPO_URL}${NC}"
echo ""

# Function to check if git is installed
check_git() {
  if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed. Please install Git and try again.${NC}"
    exit 1
  fi
}

# Function to check if the current directory is a git repository
check_git_repo() {
  if [ ! -d ".git" ]; then
    echo -e "${YELLOW}This directory is not a Git repository. Initializing...${NC}"
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
  else
    echo -e "${GREEN}Git repository already exists.${NC}"
  fi
}

# Function to check and set the remote repository
setup_remote() {
  # Check if origin remote exists
  if git remote | grep -q "origin"; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
      echo -e "${YELLOW}Remote 'origin' exists but points to a different URL.${NC}"
      echo -e "${YELLOW}Current remote: $CURRENT_REMOTE${NC}"
      echo -e "${YELLOW}Setting remote 'origin' to: $REPO_URL${NC}"
      git remote set-url origin "$REPO_URL"
    else
      echo -e "${GREEN}Remote 'origin' already set to: $REPO_URL${NC}"
    fi
  else
    echo -e "${YELLOW}Setting remote 'origin' to: $REPO_URL${NC}"
    git remote add origin "$REPO_URL"
  fi
}

# Function to commit and push changes
commit_and_push() {
  # Check if there are any changes to commit
  if git status --porcelain | grep -q .; then
    echo -e "${YELLOW}Changes detected. Adding all files...${NC}"
    git add .
    
    # Prompt for commit message
    echo -e "${YELLOW}Enter commit message (default: 'Update TradeNavigator project'):${NC}"
    read -r COMMIT_MESSAGE
    
    # Use default message if none provided
    if [ -z "$COMMIT_MESSAGE" ]; then
      COMMIT_MESSAGE="Update TradeNavigator project"
    fi
    
    # Commit changes
    echo -e "${YELLOW}Committing with message: '$COMMIT_MESSAGE'${NC}"
    git commit -m "$COMMIT_MESSAGE"
  else
    echo -e "${GREEN}No changes to commit.${NC}"
  fi
  
  # Prompt for branch name
  echo -e "${YELLOW}Enter branch name (default: 'main'):${NC}"
  read -r BRANCH_NAME
  
  # Use default branch if none provided
  if [ -z "$BRANCH_NAME" ]; then
    BRANCH_NAME="main"
  fi
  
  # Check if branch exists locally
  if ! git show-ref --quiet --verify "refs/heads/$BRANCH_NAME"; then
    echo -e "${YELLOW}Branch '$BRANCH_NAME' doesn't exist locally. Creating it...${NC}"
    git checkout -b "$BRANCH_NAME"
  else
    echo -e "${GREEN}Switching to branch '$BRANCH_NAME'${NC}"
    git checkout "$BRANCH_NAME"
  fi
  
  # Push to GitHub
  echo -e "${YELLOW}Pushing to GitHub...${NC}"
  git push -u origin "$BRANCH_NAME"
  
  # Check push result
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully pushed to GitHub repository!${NC}"
    echo -e "${GREEN}Repository URL: $REPO_URL${NC}"
  else
    echo -e "${RED}Failed to push to GitHub. Please check your credentials and try again.${NC}"
    echo -e "${YELLOW}Tip: If you're using HTTPS, you might need to provide your GitHub username and password/token.${NC}"
    echo -e "${YELLOW}Consider using SSH authentication for easier access: https://docs.github.com/en/authentication/connecting-to-github-with-ssh${NC}"
  fi
}

# Main execution flow
check_git
check_git_repo
setup_remote
commit_and_push

echo -e "${BLUE}=== Script Complete ===${NC}"
