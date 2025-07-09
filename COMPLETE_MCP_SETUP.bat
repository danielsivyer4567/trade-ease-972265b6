@echo off
echo Setting up Claude Desktop MCP configuration...
echo.

:: Create Claude directory if it doesn't exist
if not exist "%APPDATA%\Claude" (
    mkdir "%APPDATA%\Claude"
    echo Created Claude directory
)

:: Copy the config file
copy "%~dp0claude_desktop_config.json" "%APPDATA%\Claude\claude_desktop_config.json"

if %errorlevel% equ 0 (
    echo ✅ MCP configuration copied successfully!
    echo.
    echo Next steps:
    echo 1. Close Claude Desktop if it's running
    echo 2. Restart Claude Desktop
    echo 3. Test MCP commands in a new conversation
    echo.
    echo Test command: "List the main directories in my Trade Ease project"
) else (
    echo ❌ Failed to copy configuration file
    echo Please copy manually:
    echo From: %~dp0claude_desktop_config.json
    echo To: %APPDATA%\Claude\claude_desktop_config.json
)

echo.
echo MCP Config file location: %APPDATA%\Claude\claude_desktop_config.json
pause 