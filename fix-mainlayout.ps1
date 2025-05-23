Write-Host "🔧 Fixing ALL MainLayout import paths..."

# Get all TypeScript/TSX files that import MainLayout
$files = Get-ChildItem -Path "client\src" -Recurse -Include "*.tsx", "*.ts" | Where-Object {
    (Get-Content $_.FullName -Raw) -match "MainLayout"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $relativePath = $file.FullName
    
    Write-Host "Processing: $relativePath"
    
    # Calculate correct path based on file location
    if ($file.FullName -match "pages\\dashboard\\") {
        # Files in pages/dashboard/ need ../../components/layouts/MainLayout
        $content = $content -replace "import\s+.*MainLayout.*from\s+['""].*['""];?", "import MainLayout from '../../components/layouts/MainLayout';"
    }
    elseif ($file.FullName -match "pages\\settings\\") {
        # Files in pages/settings/ need ../../components/layouts/MainLayout  
        $content = $content -replace "import\s+.*MainLayout.*from\s+['""].*['""];?", "import MainLayout from '../../components/layouts/MainLayout';"
    }
    elseif ($file.FullName -match "pages\\") {
        # Files in pages/ need ../components/layouts/MainLayout
        $content = $content -replace "import\s+.*MainLayout.*from\s+['""].*['""];?", "import MainLayout from '../components/layouts/MainLayout';"
    }
    elseif ($file.FullName -match "components\\") {
        # Files in components/ need ./layouts/MainLayout or ../layouts/MainLayout
        if ($file.FullName -match "components\\layouts\\") {
            $content = $content -replace "import\s+.*MainLayout.*from\s+['""].*['""];?", "import MainLayout from './MainLayout';"
        } else {
            $content = $content -replace "import\s+.*MainLayout.*from\s+['""].*['""];?", "import MainLayout from './layouts/MainLayout';"
        }
    }
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "✅ All MainLayout imports fixed!"
