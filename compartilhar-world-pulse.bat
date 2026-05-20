@echo off
TITLE World Pulse - Compartilhar na Rede
SETLOCAL

echo ==========================================
echo    WORLD PULSE - MODO COMPARTILHAR
echo ==========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Node.js nao esta instalado. Instale em https://nodejs.org/
    pause
    exit /b
)

echo [1/2] Gerando a versao compartilhavel do frontend...
cd frontend
if not exist node_modules (
    echo Instalando dependencias do frontend...
    npm install
)
npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao gerar o frontend.
    pause
    exit /b
)

echo.
echo [2/2] Iniciando backend com frontend embutido...
cd ..\backend
if not exist node_modules (
    echo Instalando dependencias do backend...
    npm install
)

echo.
echo Compartilhe com quem estiver na mesma rede usando:
echo http://SEU-IP:3001
echo.
echo Exemplo:
echo http://192.168.0.10:3001
echo.
echo Mantenha esta janela aberta.
echo ==========================================
echo.
npm start
