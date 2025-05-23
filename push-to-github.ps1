# TradeNavigator GitHub Push Script

# Colors for output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

# GitHub repository URL
$RepoUrl = "https://github.com/JulesSitpach/tradenavigator-clean.git"

Write-Host "=== TradeNavigator GitHub Push Script ===" -ForegroundColor $Blue
Write-Host "This script will push your code to: $RepoUrl" -ForegroundColor $Yellow
Write-Host ""

# Function to check if git is installed
function Check-Git {
    try {
        $null = Get-Command git -ErrorAction Stop
        return $true
    }
    catch {
        Write-Host "Error: Git is not installed. Please install Git and try again." -ForegroundColor $Red
        return $false
    }
}

# Function to check if the current directory is a git repository
function Check-GitRepo {
    if (-not (Test-Path .git)) {
        Write-Host "This directory is not a Git repository. Initializing..." -ForegroundColor $Yellow
        git init
        Write-Host "Git repository initialized." -ForegroundColor $Green
    }
    else {
        Write-Host "Git repository already exists." -ForegroundColor $Green
    }
}

# Function to check and set the remote repository
function Setup-Remote {
    $remotes = git remote
    if ($remotes -contains "origin") {
        $currentRemote = git remote get-url origin
        if ($currentRemote -ne $RepoUrl) {
            Write-Host "Remote 'origin' exists but points to a different URL." -ForegroundColor $Yellow
            Write-Host "Current remote: $currentRemote" -ForegroundColor $Yellow
            Write-Host "Setting remote 'origin' to: $RepoUrl" -ForegroundColor $Yellow
            git remote set-url origin $RepoUrl
        }
        else {
            Write-Host "Remote 'origin' already set to: $RepoUrl" -ForegroundColor $Green
        }
    }
    else {
        Write-Host "Setting remote 'origin' to: $RepoUrl" -ForegroundColor $Yellow
        git remote add origin $RepoUrl
    }
}

# Function to commit and push changes
function Commit-And-Push {
    # Check if there are any changes to commit
    $status = git status --porcelain
    if ($status) {
        Write-Host "Changes detected. Adding all files..." -ForegroundColor $Yellow
        git add .
        
        # Prompt for commit message
        $commitMessage = Read-Host "Enter commit message (default: 'Update TradeNavigator project')"
        
        # Use default message if none provided
        if (-not $commitMessage) {
            $commitMessage = "Update TradeNavigator project"
        }
        
        # Commit changes
        Write-Host "Committing with message: '$commitMessage'" -ForegroundColor $Yellow
        git commit -m $commitMessage
    }
    else {
        Write-Host "No changes to commit." -ForegroundColor $Green
    }
    
    # Prompt for branch name
    $branchName = Read-Host "Enter branch name (default: 'main')"
    
    # Use default branch if none provided
    if (-not $branchName) {
        $branchName = "main"
    }
    
    # Check if branch exists locally
    $branchExists = git show-ref --quiet --verify "refs/heads/$branchName"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Branch '$branchName' doesn't exist locally. Creating it..." -ForegroundColor $Yellow
        git checkout -b $branchName
    }
    else {
        Write-Host "Switching to branch '$branchName'" -ForegroundColor $Green
        git checkout $branchName
    }
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor $Yellow
    git push -u origin $branchName
    
    # Check push result
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed to GitHub repository!" -ForegroundColor $Green
        Write-Host "Repository URL: $RepoUrl" -ForegroundColor $Green
    }
    else {
        Write-Host "Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor $Red
        Write-Host "Tip: If you're using HTTPS, you might need to provide your GitHub username and password/token." -ForegroundColor $Yellow
        Write-Host "Consider using SSH authentication for easier access: https://docs.github.com/en/authentication/connecting-to-github-with-ssh" -ForegroundColor $Yellow
    }
}

# Main execution flow
if (Check-Git) {
    Check-GitRepo
    Setup-Remote
    Commit-And-Push
}

Write-Host "=== Script Complete ===" -ForegroundColor $Blue
