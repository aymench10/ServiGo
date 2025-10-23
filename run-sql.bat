@echo off
REM Script pour exécuter des fichiers SQL via Supabase CLI

if "%1"=="" (
    echo Usage: run-sql.bat ^<fichier.sql^>
    echo Exemple: run-sql.bat CHECK_USER_PROFILE.sql
    exit /b 1
)

echo.
echo Execution du fichier SQL: %1
echo ============================================
echo.

REM Lire le fichier SQL et l'exécuter via l'API Supabase
node -e "const fs=require('fs');const https=require('https');require('dotenv').config();const sql=fs.readFileSync('%1','utf8');const url=process.env.VITE_SUPABASE_URL;const ref=new URL(url).hostname.split('.')[0];const token=process.env.SUPABASE_ACCESS_TOKEN;const data=JSON.stringify({query:sql});const options={hostname:'api.supabase.com',port:443,path:`/v1/projects/${ref}/database/query`,method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`,'Content-Length':data.length}};const req=https.request(options,res=>{let body='';res.on('data',d=>body+=d);res.on('end',()=>{const result=JSON.parse(body);if(res.statusCode===200){console.log('✅ Succès!');console.log(JSON.stringify(result,null,2));}else{console.error('❌ Erreur:',result);}});});req.on('error',e=>console.error(e));req.write(data);req.end();"

echo.
echo ============================================
echo Terminé
echo.
