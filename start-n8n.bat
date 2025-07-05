@echo off
REM n8n Quick Start Script for Windows
REM This script starts n8n using Docker for development

echo 🚀 Starting n8n with Docker...
echo This will make n8n available at http://localhost:5678

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first:
    echo    https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Stop any existing n8n container
echo 🛑 Stopping any existing n8n container...
docker stop n8n >nul 2>&1
docker rm n8n >nul 2>&1

REM Start n8n with persistent data and proper configuration
echo ▶️  Starting n8n...
docker run -d --name n8n -p 5678:5678 ^
  -e GENERIC_TIMEZONE="America/New_York" ^
  -e TZ="America/New_York" ^
  -e N8N_CORS_ORIGIN="http://localhost:3000,http://localhost:8080,http://localhost:5173" ^
  -e N8N_SKIP_INSTANCE_OWNER_SETUP=true ^
  -e N8N_USER_MANAGEMENT_DISABLED=true ^
  -e N8N_BASIC_AUTH_ACTIVE=false ^
  -e N8N_ENCRYPTION_KEY="n8n-trade-ease-encryption-key-2024" ^
  -v n8n_data:/home/node/.n8n ^
  n8nio/n8n

if errorlevel 1 (
    echo ❌ Failed to start n8n. Check Docker installation and try again.
    pause
    exit /b 1
) else (
    echo ✅ n8n started successfully!
    echo.
    echo 🌐 Access n8n at: http://localhost:5678
    echo 📱 Access your app at: http://localhost:3000
    echo.
    echo To stop n8n, run: docker stop n8n
    echo To view logs, run: docker logs -f n8n
    echo.
    pause
) 