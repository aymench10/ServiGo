# Script de verification Supabase CLI
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION SUPABASE CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=#]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
        }
    }
}

# Test 1: Variables d'environnement
Write-Host "1. Variables d'environnement:" -ForegroundColor Yellow
Write-Host "   VITE_SUPABASE_URL: " -NoNewline
if ($env:VITE_SUPABASE_URL) {
    Write-Host "OK" -ForegroundColor Green
    Write-Host "      Value: $env:VITE_SUPABASE_URL" -ForegroundColor Gray
} else {
    Write-Host "MISSING" -ForegroundColor Red
}

Write-Host "   VITE_SUPABASE_ANON_KEY: " -NoNewline
if ($env:VITE_SUPABASE_ANON_KEY) {
    Write-Host "OK" -ForegroundColor Green
    $keyPreview = $env:VITE_SUPABASE_ANON_KEY.Substring(0, [Math]::Min(30, $env:VITE_SUPABASE_ANON_KEY.Length))
    Write-Host "      Value: $keyPreview..." -ForegroundColor Gray
} else {
    Write-Host "MISSING" -ForegroundColor Red
}

Write-Host "   SUPABASE_ACCESS_TOKEN: " -NoNewline
if ($env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "OK" -ForegroundColor Green
    $tokenPreview = $env:SUPABASE_ACCESS_TOKEN.Substring(0, [Math]::Min(20, $env:SUPABASE_ACCESS_TOKEN.Length))
    Write-Host "      Value: $tokenPreview..." -ForegroundColor Gray
} else {
    Write-Host "MISSING" -ForegroundColor Red
}

Write-Host ""

# Test 2: Project Reference
Write-Host "2. Project Reference:" -ForegroundColor Yellow
if ($env:VITE_SUPABASE_URL) {
    $projectRef = ([System.Uri]$env:VITE_SUPABASE_URL).Host.Split('.')[0]
    Write-Host "   Project ID: $projectRef" -ForegroundColor Green
} else {
    Write-Host "   Cannot extract project ID" -ForegroundColor Red
}

Write-Host ""

# Test 3: Supabase CLI
Write-Host "3. Supabase CLI:" -ForegroundColor Yellow
try {
    $version = npx supabase --version 2>&1 | Select-String -Pattern "\d+\.\d+\.\d+"
    Write-Host "   Version: $version" -ForegroundColor Green
} catch {
    Write-Host "   CLI not found" -ForegroundColor Red
}

Write-Host ""

# Test 4: API Connection
Write-Host "4. API Connection Test:" -ForegroundColor Yellow
if ($env:VITE_SUPABASE_URL -and $env:SUPABASE_ACCESS_TOKEN) {
    $projectRef = ([System.Uri]$env:VITE_SUPABASE_URL).Host.Split('.')[0]
    $apiUrl = "https://api.supabase.com/v1/projects/$projectRef"
    
    try {
        $headers = @{
            "Authorization" = "Bearer $env:SUPABASE_ACCESS_TOKEN"
        }
        $response = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "   Connection: OK" -ForegroundColor Green
        Write-Host "   Project Name: $($response.name)" -ForegroundColor Gray
        Write-Host "   Region: $($response.region)" -ForegroundColor Gray
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    } catch {
        Write-Host "   Connection: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   Skipped (missing credentials)" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Database Query Test
Write-Host "5. Database Query Test:" -ForegroundColor Yellow
if ($env:VITE_SUPABASE_URL -and $env:SUPABASE_ACCESS_TOKEN) {
    $projectRef = ([System.Uri]$env:VITE_SUPABASE_URL).Host.Split('.')[0]
    $apiUrl = "https://api.supabase.com/v1/projects/$projectRef/database/query"
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $env:SUPABASE_ACCESS_TOKEN"
        }
        $body = @{ query = "SELECT version();" } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body -ErrorAction Stop
        Write-Host "   Query Execution: OK" -ForegroundColor Green
        if ($response[0].rows) {
            Write-Host "   PostgreSQL Version: $($response[0].rows[0].version)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   Query Execution: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   Skipped (missing credentials)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
