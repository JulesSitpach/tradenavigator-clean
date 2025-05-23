@echo off
echo === TradeNavigator GitHub Push Script ===
echo This script will push your code to: https://github.com/JulesSitpach/tradenavigator-clean.git
echo.

set REPO_URL=https://github.com/JulesSitpach/tradenavigator-clean.git

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed. Please install Git and try again.
    exit /b 1
)

REM Check if the current directory is a git repository
if not exist .git (
    echo This directory is not a Git repository. Initializing...
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

REM Check and set the remote repository
git remote | findstr "origin" >nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%a in ('git remote get-url origin') do set CURRENT_REMOTE=%%a
    if not "%CURRENT_REMOTE%"=="%REPO_URL%" (
        echo Remote 'origin' exists but points to a different URL.
        echo Current remote: %CURRENT_REMOTE%
        echo Setting remote 'origin' to: %REPO_URL%
        git remote set-url origin %REPO_URL%
    ) else (
        echo Remote 'origin' already set to: %REPO_URL%
    )
) else (
    echo Setting remote 'origin' to: %REPO_URL%
    git remote add origin %REPO_URL%
)

REM Check if there are any changes to commit
git status --porcelain > git_status.tmp
findstr /r /c:"." git_status.tmp >nul
if %ERRORLEVEL% equ 0 (
    echo Changes detected. Adding all files...
    git add .
    
    REM Prompt for commit message
    set /p COMMIT_MESSAGE=Enter commit message (default: 'Update TradeNavigator project'): 
    
    REM Use default message if none provided
    if "%COMMIT_MESSAGE%"=="" set COMMIT_MESSAGE=Update TradeNavigator project
    
    REM Commit changes
    echo Committing with message: '%COMMIT_MESSAGE%'
    git commit -m "%COMMIT_MESSAGE%"
) else (
    echo No changes to commit.
)
del git_status.tmp

REM Prompt for branch name
set /p BRANCH_NAME=Enter branch name (default: 'main'): 

REM Use default branch if none provided
if "%BRANCH_NAME%"=="" set BRANCH_NAME=main

REM Check if branch exists locally
git show-ref --quiet --verify "refs/heads/%BRANCH_NAME%"
if %ERRORLEVEL% neq 0 (
    echo Branch '%BRANCH_NAME%' doesn't exist locally. Creating it...
    git checkout -b %BRANCH_NAME%
) else (
    echo Switching to branch '%BRANCH_NAME%'
    git checkout %BRANCH_NAME%
)

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin %BRANCH_NAME%

REM Check push result
if %ERRORLEVEL% equ 0 (
    echo Successfully pushed to GitHub repository!
    echo Repository URL: %REPO_URL%
) else (
    echo Failed to push to GitHub. Please check your credentials and try again.
    echo Tip: If you're using HTTPS, you might need to provide your GitHub username and password/token.
    echo Consider using SSH authentication for easier access: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
)

echo === Script Complete ===
pause
