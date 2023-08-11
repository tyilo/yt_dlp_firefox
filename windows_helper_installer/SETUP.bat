@echo off
:: Check for administrator privileges
NET SESSION >NUL 2>&1
IF %ERRORLEVEL% EQU 0 (
    :: Script is running with administrator privileges
    goto main
) ELSE (
    :: Relaunch the script as an administrator
    powershell -command "Start-Process '%0' -Verb RunAs"
    exit
)

:main
setlocal

:: Set working directory as the same as the batch file's directory
cd /d "%~dp0"

:: Check if the helper is installed
reg query "HKLM\SOFTWARE\Mozilla\NativeMessagingHosts\yt_dlp_firefox" > nul 2>&1
if %errorlevel% equ 0 (
    set "helper_installed=true"
) else (
    set "helper_installed=false"
)

:menu
cls
echo Welcome to the yt-dlp downloader for Firefox Setup Utility
echo.
if "%helper_installed%"=="true" (
    echo Choose an option:
    echo 1. Reinstall yt-dlp Firefox Helper
    echo 2. Uninstall yt-dlp Firefox Helper
    echo 3. Exit
) else (
    echo Choose an option:
    echo 1. Install yt-dlp Firefox Helper
    echo 2. Exit
)
echo.

set /p "option=Enter the option number: "
echo.

if "%helper_installed%"=="true" (
    if "%option%"=="1" goto reinstall
    if "%option%"=="2" goto uninstall
    if "%option%"=="3" goto exit
) else (
    if "%option%"=="1" goto install
    if "%option%"=="2" goto exit
)

echo Invalid option. Please choose a valid option.
pause
goto menu

:install
echo Welcome to the yt-dlp downloader for Firefox Helper Installer

:: Prompt user for installation directory
set /p "install_dir=Enter the installation directory (e.g., C:\Program Files\yt_dlp_firefox, press Enter for default): "
if "%install_dir%"=="" set "install_dir=%userprofile%\AppData\Local\yt_dlp_firefox"
echo.

:: Check if installation directory exists
if not exist "%install_dir%" (
    mkdir "%install_dir%"
    echo Created directory: "%install_dir%"
)

:: Check if Python is installed
where python > nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed.
    echo Please install Python from the Microsoft Store: https://www.microsoft.com/en-us/p/python/9p7qfqmjrfp7
    echo After installing Python, rerun this installer.
    pause
    exit /b
)

:: Download yt-dlp.exe
echo Downloading yt-dlp.exe...
bitsadmin /transfer "yt_dlp_download" "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" "%install_dir%\yt-dlp.exe"

:: Check if download was successful
if %errorlevel% neq 0 (
    echo Failed to download yt-dlp.exe. Exiting.
    pause
    exit /b
)

:: Copy other files to the installation directory
copy "yt_dlp_firefox.py" "%install_dir%"
copy "yt_dlp_firefox.bat" "%install_dir%"
copy "yt_dlp_firefox.json" "%install_dir%"

:: Update the registry entry
reg add "HKLM\SOFTWARE\Mozilla\NativeMessagingHosts\yt_dlp_firefox" /ve /d "%install_dir%\yt_dlp_firefox.json" /f
echo Updated registry entry for NativeMessagingHosts.

:: Add installation directory to PATH
setx PATH "%install_dir%;%PATH%" /M > nul 2>&1
echo Added installation directory to PATH.

:: Display installation results
echo.
echo Installation complete! The yt-dlp Firefox Helper has been installed to "%install_dir%"
echo.

pause
goto end

:reinstall
echo Reinstalling yt-dlp Firefox Helper...

:: Call uninstallation process
call :uninstall

:: Call installation process
call :install
goto end

:uninstall
echo Uninstalling yt-dlp Firefox Helper...

:: Remove registry entry
reg delete "HKLM\SOFTWARE\Mozilla\NativeMessagingHosts\yt_dlp_firefox" /f > nul 2>&1
echo Removed registry entry for NativeMessagingHosts.

:: Remove installation directory from PATH
setx PATH "%PATH:install_dir=%" /M > nul 2>&1
echo Removed installation directory from PATH.

:: Display uninstallation results
echo.
echo Uninstallation complete! The yt-dlp Firefox Helper has been uninstalled.
echo.

goto end

:exit
echo Goodbye!
goto end

:end
