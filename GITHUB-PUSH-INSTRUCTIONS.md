# How to Push to GitHub

I've created three scripts to help you push your TradeNavigator project to GitHub. Choose the one that works best for your operating system:

## For Windows Users (Option 1): Using Batch File

1. Double-click on `push-to-github.bat`
2. Follow the prompts to enter a commit message and branch name
3. Enter your GitHub credentials when prompted

## For Windows Users (Option 2): Using PowerShell

1. Right-click on `push-to-github.ps1` and select "Run with PowerShell"
   - If you get a security warning, you may need to run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
2. Follow the prompts to enter a commit message and branch name
3. Enter your GitHub credentials when prompted

## For Mac/Linux Users: Using Bash

1. Open Terminal
2. Navigate to your project directory
3. Make the script executable:
   ```
   chmod +x push-to-github.sh
   ```
4. Run the script:
   ```
   ./push-to-github.sh
   ```
5. Follow the prompts to enter a commit message and branch name
6. Enter your GitHub credentials when prompted

## Manual Push (Alternative Method)

If you prefer to push manually, you can use these commands:

```
git init
git add .
git commit -m "Your commit message"
git remote add origin https://github.com/JulesSitpach/tradenavigator-clean.git
git push -u origin main
```

## Note on GitHub Authentication

- If you're using HTTPS, you'll need to provide your GitHub username and a personal access token (not your password)
- GitHub no longer accepts passwords for HTTPS Git operations
- To create a personal access token:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  2. Select at least the "repo" scope
  3. Use this token instead of your password when prompted

For more information, see: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
