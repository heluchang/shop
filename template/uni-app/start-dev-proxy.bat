@echo off
chcp 65001 > nul
title CRMEB Dev Proxy
echo.
echo ====================================
echo   CRMEB uni-app Dev Proxy
echo ====================================
echo.
echo Forward:  http://localhost:9000  -^>  https://423.ll0x3.cn
echo.
echo [Ctrl+C to stop]
echo.
node "%~dp0dev-proxy.js"
pause
