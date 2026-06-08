@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ==================================================
echo    QUINTAL DO HUNGRIA - abrindo o site
echo  ==================================================
echo.

REM Mata qualquer servidor antigo preso na porta 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

if not exist "node_modules" (
  echo  Instalando dependencias (primeira vez, pode demorar)...
  call npm install
)
if not exist "out\index.html" (
  echo  Compilando o site (pode levar 1-2 min)...
  call npm run build
)

echo.
echo  Subindo o servidor... o navegador abre sozinho em http://localhost:3000
echo.
echo   *** MANTENHA ESTA JANELA PRETA ABERTA enquanto estiver usando o site ***
echo       (se fechar, o site sai do ar)
echo.

REM Abre o navegador 3s depois (tempo do servidor subir)
start "" /min cmd /c "timeout /t 3 >nul && start http://localhost:3000"

REM Servidor (segura a janela aberta enquanto serve)
call npx -y serve out -l 3000

echo.
echo  --------------------------------------------------
echo   O servidor parou. Se apareceu algum ERRO acima,
echo   tire um print e me mande.
echo  --------------------------------------------------
pause
