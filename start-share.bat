@echo off
chcp 65001 >nul
cd /d "%~dp0"

set PORT=8765
set PYTHON_CMD=

where python >nul 2>nul
if %errorlevel%==0 set PYTHON_CMD=python

if "%PYTHON_CMD%"=="" (
  where py >nul 2>nul
  if %errorlevel%==0 set PYTHON_CMD=py
)

if "%PYTHON_CMD%"=="" (
  if exist "D:\python.exe" set PYTHON_CMD=D:\python.exe
)

if "%PYTHON_CMD%"=="" (
  echo Python was not found. Please install Python or start the page by opening index.html directly.
  pause
  exit /b 1
)

echo.
echo WeRead Knowledge Forest is being shared on this network.
echo.
echo Open this address on another computer or phone connected to the same Wi-Fi:
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } | ForEach-Object { '  http://' + $_.IPAddress + ':%PORT%/index.html' }"
echo.
echo Keep this window open while presenting.
echo Press Ctrl+C to stop sharing.
echo.

%PYTHON_CMD% -m http.server %PORT% --bind 0.0.0.0
