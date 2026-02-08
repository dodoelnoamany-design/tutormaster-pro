#!/bin/bash

# بناء APK كامل من الصفر
# لـ Mac/Linux

echo "🚀 بدء بناء APK..."

# الخطوة 1: بناء التطبيق
echo "📦 بناء التطبيق React..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ فشل البناء"
  exit 1
fi

# الخطوة 2: مزامنة Capacitor
echo "📱 مزامنة Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
  echo "❌ فشل المزامنة"
  exit 1
fi

# الخطوة 3: بناء APK
echo "🔨 بناء APK..."
cd android
./gradlew clean assembleDebug

if [ $? -eq 0 ]; then
  echo "✅ تم البناء بنجاح!"
  echo "📍 الملف: android/app/build/outputs/apk/debug/app-debug.apk"
  # فتح مجلد الملف
  open "app/build/outputs/apk/debug/"
else
  echo "❌ فشل البناء"
  exit 1
fi
