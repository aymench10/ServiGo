# Simple PowerShell script to run SQL files
param([Parameter(Mandatory=$true)][string]$SqlFile)

if (-not (Test-Path $SqlFile)) {
    Write-Error "File not found: $SqlFile"
    exit 1
}

# Load .env file
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=#]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
        }
    }
}

$sqlContent = Get-Content $SqlFile -Raw
$supabaseUrl = $env:VITE_SUPABASE_URL
$accessToken = $env:SUPABASE_ACCESS_TOKEN

if (-not $supabaseUrl -or -not $accessToken) {
    Write-Host ""
    Write-Host "ERROR: Missing environment variables" -ForegroundColor Red
    Write-Host "  VITE_SUPABASE_URL: $(if($supabaseUrl){'OK'}else{'MISSING'})" -ForegroundColor Yellow
    Write-Host "  SUPABASE_ACCESS_TOKEN: $(if($accessToken){'OK'}else{'MISSING'})" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

$projectRef = ([System.Uri]$supabaseUrl).Host.Split('.')[0]
$apiUrl = "https://api.supabase.com/v1/projects/$projectRef/database/query"

Write-Host ""
Write-Host "Executing SQL file: $SqlFile" -ForegroundColor Cyan
Write-Host "Project: $projectRef" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $accessToken"
}

$body = @{ query = $sqlContent } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    Write-Host "SUCCESS! SQL executed" -ForegroundColor Green
    Write-Host ""
    
    if ($response -is [Array]) {
        for ($i = 0; $i -lt $response.Count; $i++) {
            Write-Host "Query $($i + 1) Results:" -ForegroundColor Yellow
            Write-Host "------------------------------------------------------------"
            
            if ($response[$i].rows -and $response[$i].rows.Count -gt 0) {
                $response[$i].rows | Format-Table -AutoSize
                Write-Host "Rows: $($response[$i].rows.Count)" -ForegroundColor Gray
            } else {
                Write-Host "No rows returned" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } else {
        $response | ConvertTo-Json -Depth 10
    }
    
    Write-Host "============================================" -ForegroundColor Gray
    Write-Host "Done!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
