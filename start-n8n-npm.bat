@echo off
REM n8n Quick Start Script for Windows (npm version)
REM This script starts n8n using npm for development

echo 🚀 Starting n8n with npm...
echo This will make n8n available at http://localhost:5678

REM Set environment variables for n8n
set N8N_SKIP_INSTANCE_OWNER_SETUP=true
set N8N_USER_MANAGEMENT_DISABLED=true
set N8N_BASIC_AUTH_ACTIVE=false
set N8N_ENCRYPTION_KEY=n8n-trade-ease-encryption-key-2024
set N8N_CORS_ORIGIN=http://localhost:3000,http://localhost:8080,http://localhost:5173

echo ▶️  Starting n8n...
echo.
echo 🌐 n8n will be available at: http://localhost:5678
echo 📱 Your app will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop n8n
echo.

npx n8n start 