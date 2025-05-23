# Simple PowerShell script to commit and push changes

# Colors for output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue

Write-Host "=== TradeNavigator Update Script ===" -ForegroundColor $Blue
Write-Host "This script will commit and push your recent changes" -ForegroundColor $Yellow
Write-Host ""

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
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor $Yellow
    git push
    
    # Check push result
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed changes to GitHub!" -ForegroundColor $Green
    }
    else {
        Write-Host "Failed to push. You may need to pull changes first or check your connection." -ForegroundColor $Yellow
        $pull = Read-Host "Would you like to pull changes first? (y/n)"
        if ($pull -eq "y") {
            git pull
            Write-Host "Trying to push again..." -ForegroundColor $Yellow
            git push
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Successfully pushed changes to GitHub!" -ForegroundColor $Green
            }
        }
    }
}
else {
    Write-Host "No changes detected to commit." -ForegroundColor $Green
}

Write-Host "=== Script Complete ===" -ForegroundColor $Blue
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
