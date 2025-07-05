# n8n Quick Start Script for Windows (PowerShell)
# This script starts n8n with proper configuration

Write-Host "🚀 Starting n8n..." -ForegroundColor Green
Write-Host "This will make n8n available at http://localhost:5678" -ForegroundColor Cyan

# Set environment variables for n8n
$env:N8N_SKIP_INSTANCE_OWNER_SETUP = "true"
$env:N8N_USER_MANAGEMENT_DISABLED = "true"
$env:N8N_BASIC_AUTH_ACTIVE = "false"
$env:N8N_ENCRYPTION_KEY = "n8n-trade-ease-encryption-key-2024"
$env:N8N_CORS_ORIGIN = "http://localhost:3000,http://localhost:8080,http://localhost:5173"

Write-Host ""
Write-Host "🔧 Environment configured:" -ForegroundColor Yellow
Write-Host "   - Skip instance owner setup: $env:N8N_SKIP_INSTANCE_OWNER_SETUP" -ForegroundColor Gray
Write-Host "   - User management disabled: $env:N8N_USER_MANAGEMENT_DISABLED" -ForegroundColor Gray
Write-Host "   - Basic auth disabled: $env:N8N_BASIC_AUTH_ACTIVE" -ForegroundColor Gray
Write-Host "   - CORS origins set for local development" -ForegroundColor Gray
Write-Host ""

Write-Host "▶️  Starting n8n..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 n8n will be available at: http://localhost:5678" -ForegroundColor Cyan
Write-Host "📱 Your app will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop n8n" -ForegroundColor Yellow
Write-Host ""

# Start n8n
try {
    npx n8n start
}
catch {
    Write-Host "❌ Failed to start n8n. Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure you have Node.js installed and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
} 