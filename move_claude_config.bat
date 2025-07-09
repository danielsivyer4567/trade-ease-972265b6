@echo off
echo Moving Claude Desktop configuration file...
echo.

REM Define source and destination paths
set "SOURCE=C:\Users\danie\Downloads\dansversion\trade-ease-972265b6\claude_desktop_config.json"
set "DEST_DIR=%APPDATA%\Claude"
set "DEST_FILE=%APPDATA%\Claude\claude_desktop_config.json"

REM Check if source file exists
if not exist "%SOURCE%" (
    echo ERROR: Source file not found at %SOURCE%
    pause
    exit /b 1
)

REM Create destination directory if it doesn't exist
if not exist "%DEST_DIR%" (
    echo Creating directory: %DEST_DIR%
    mkdir "%DEST_DIR%"
    if errorlevel 1 (
        echo ERROR: Failed to create destination directory
        pause
        exit /b 1
    )
)

REM Backup existing config if it exists
if exist "%DEST_FILE%" (
    echo Backing up existing configuration...
    copy "%DEST_FILE%" "%DEST_FILE%.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
    if errorlevel 1 (
        echo WARNING: Failed to create backup
    ) else (
        echo Backup created successfully
    )
)

REM Copy the configuration file
echo Copying configuration file...
copy "%SOURCE%" "%DEST_FILE%" >nul
if errorlevel 1 (
    echo ERROR: Failed to copy configuration file
    pause
    exit /b 1
)

REM Verify the copy was successful
if exist "%DEST_FILE%" (
    echo SUCCESS: Configuration file copied successfully!
    echo From: %SOURCE%
    echo To:   %DEST_FILE%
    echo.
    echo The Claude Desktop configuration has been installed.
    echo You may need to restart Claude Desktop for changes to take effect.
) else (
    echo ERROR: Copy operation appeared to succeed but file not found at destination
    pause
    exit /b 1
)

echo.
echo Press any key to exit...
pause >nul
