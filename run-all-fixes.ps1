# Script pour exécuter toutes les corrections d'authentification
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRECTION COMPLETE AUTHENTIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scripts = @(
    @{Name="Étape 1: Création des tables"; File="FIX_AUTH_STEP1_TABLES.sql"},
    @{Name="Étape 2: Trigger automatique"; File="FIX_AUTH_STEP2_TRIGGER.sql"},
    @{Name="Étape 3: Configuration RLS"; File="FIX_AUTH_STEP3_RLS.sql"},
    @{Name="Étape 4: Synchronisation profils"; File="FIX_AUTH_STEP4_SYNC_PROFILES.sql"},
    @{Name="Vérification finale"; File="VERIFY_AUTH_SETUP.sql"}
)

$success = 0
$failed = 0

foreach ($script in $scripts) {
    Write-Host "$($script.Name)..." -ForegroundColor Yellow
    Write-Host "  Fichier: $($script.File)" -ForegroundColor Gray
    
    try {
        $result = npm run sql $script.File 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Succès" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  ✗ Échec" -ForegroundColor Red
            Write-Host "  $result" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "  ✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RÉSUMÉ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Succès: $success" -ForegroundColor Green
Write-Host "  Échecs: $failed" -ForegroundColor $(if($failed -eq 0){"Green"}else{"Red"})
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 TOUTES LES CORRECTIONS ONT ÉTÉ APPLIQUÉES AVEC SUCCÈS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Consultez AUTH_FIX_SUMMARY.md pour plus de détails." -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Certaines corrections ont échoué. Vérifiez les erreurs ci-dessus." -ForegroundColor Yellow
}
Write-Host ""
