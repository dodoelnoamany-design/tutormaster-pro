@echo off
REM بناء APK كامل من الصفر
REM لـ Windows

setlocal enabledelayedexpansion

echo ============================================
echo.	🚀 بدء بناء APK
echo ============================================
echo.

REM الخطوة 1: بناء التطبيق
echo 📦 بناء التطبيق React...
call npm run build
if errorlevel 1 (
  echo.
  echo ❌ فشل البناء
  pause
  exit /b 1
)

REM الخطوة 2: مزامنة Capacitor
echo.
echo 📱 مزامنة Capacitor...
call npx cap sync android
if errorlevel 1 (
  echo.
  echo ❌ فشل المزامنة
  pause
  exit /b 1
)

REM الخطوة 3: بناء APK
echo.
echo 🔨 بناء APK (قد يستغرق 2-5 دقائق)...
cd android
call gradlew.bat clean assembleDebug

if errorlevel 1 (
  echo.
  echo ❌ فشل البناء
  pause
  exit /b 1
) else (
  echo.
  echo ============================================
  echo.	✅ تم البناء بنجاح!
  echo.	📍 الملف: app\build\outputs\apk\debug\app-debug.apk
  echo.	🎉 يمكنك تثبيته على هاتفك الآن!
  echo.
  echo ============================================
  
  REM فتح مجلد الملف
  start "explorer" "app\build\outputs\apk\debug\"
  
  cd ..
)

pause
