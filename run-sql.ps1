# Script PowerShell pour exécuter des fichiers SQL via Supabase CLI
param(
    [Parameter(Mandatory=$true)]
    [string]$SqlFile
)

# Vérifier si le fichier existe
if (-not (Test-Path $SqlFile)) {
    Write-Error "Fichier non trouvé: $SqlFile"
    exit 1
}

# Charger les variables d'environnement depuis .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Lire le fichier SQL
$sqlContent = Get-Content $SqlFile -Raw

# Obtenir les variables d'environnement
$supabaseUrl = $env:VITE_SUPABASE_URL
$accessToken = $env:SUPABASE_ACCESS_TOKEN

if (-not $supabaseUrl -or -not $accessToken) {
    Write-Error "Variables manquantes dans .env:"
    Write-Host "  - VITE_SUPABASE_URL: $(if($supabaseUrl){'✓'}else{'✗'})"
    Write-Host "  - SUPABASE_ACCESS_TOKEN: $(if($accessToken){'✓'}else{'✗'})"
    Write-Host ""
    Write-Host "Pour obtenir votre token:"
    Write-Host "  1. Exécutez: npx supabase login"
    Write-Host "  2. Ou allez sur: https://supabase.com/dashboard/account/tokens"
    exit 1
}

# Extraire le project ref de l'URL
$projectRef = ([System.Uri]$supabaseUrl).Host.Split('.')[0]

Write-Host ""
Write-Host "📄 Exécution du fichier SQL: $SqlFile" -ForegroundColor Cyan
Write-Host "🎯 Projet: $projectRef" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Gray
Write-Host ""

# Préparer la requête
$apiUrl = "https://api.supabase.com/v1/projects/$projectRef/database/query"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $accessToken"
}
$body = @{
    query = $sqlContent
} | ConvertTo-Json

try {
    # Exécuter la requête
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    Write-Host "✅ SQL exécuté avec succès!" -ForegroundColor Green
    Write-Host ""
    
    # Afficher les résultats
    if ($response -is [Array]) {
        for ($i = 0; $i -lt $response.Count; $i++) {
            $queryResult = $response[$i]
            Write-Host "📊 Requête $($i + 1) Résultats:" -ForegroundColor Yellow
            Write-Host "------------------------------------------------------------" -ForegroundColor Gray
            
            if ($queryResult.rows -and $queryResult.rows.Count -gt 0) {
                $queryResult.rows | Format-Table -AutoSize
                Write-Host "   Lignes retournées: $($queryResult.rows.Count)" -ForegroundColor Gray
            } elseif ($queryResult.rows) {
                Write-Host "   Aucune ligne retournée" -ForegroundColor Gray
            }
            
            if ($queryResult.error) {
                Write-Host "   Erreur: $($queryResult.error)" -ForegroundColor Red
            }
            Write-Host ""
        }
    } else {
        $response | ConvertTo-Json -Depth 10 | Write-Host
    }
    
    Write-Host "============================================" -ForegroundColor Gray
    Write-Host "✨ Exécution terminée" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'exécution SQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Gray
    exit 1
}
