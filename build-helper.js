#!/usr/bin/env node

/**
 * مساعد بناء APK سريع
 * تشغيل: node build-helper.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`
╔════════════════════════════════════════════════════════════╗
║                   🚀 مساعد بناء APK                        ║
║                مدير الدروس - Tutor Master Pro            ║
╚════════════════════════════════════════════════════════════╝
`);

// فحص المتطلبات
console.log('📋 فحص المتطلبات...\n');

const checks = [
  { name: 'Node.js', cmd: 'node -v', success: false },
  { name: 'npm', cmd: 'npm -v', success: false },
  { name: 'Java', cmd: 'java -version', success: false },
];

for (const check of checks) {
  try {
    execSync(check.cmd, { stdio: 'ignore' });
    console.log(`✅ ${check.name} - مثبت`);
    check.success = true;
  } catch {
    console.log(`❌ ${check.name} - غير مثبت`);
  }
}

const nodeOk = checks[0].success && checks[1].success;
const javaOk = checks[2].success;

if (!nodeOk) {
  console.log(`
❌ Node.js و npm مطلوبان!
تحميل من: https://nodejs.org/
`);
  process.exit(1);
}

if (!javaOk) {
  console.log(`
⚠️  Java JDK غير مثبت
التثبيت:
  Windows: choco install openjdk
  Mac: brew install openjdk
  Linux: sudo apt-get install openjdk-11-jdk
`);
  process.exit(1);
}

console.log(`
✅ جميع المتطلبات متوفرة!

📊 معلومات المشروع:
${Object.entries({
  'اسم التطبيق': 'مدير الدروس',
  'معرف التطبيق': 'com.tutormaster.pro',
  'نسخة Node': execSync('node -v', { encoding: 'utf-8' }).trim(),
  'نسخة Java': execSync('java -version 2>&1 | grep version', { encoding: 'utf-8' }).trim().split('version')[1]?.trim() || 'غير معروفة',
}).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

🚀 الخطوات التالية:
  1. npm install                  (تثبيت المتطلبات)
  2. npm run build               (بناء التطبيق)
  3. npx cap add android         (إضافة Android)
  4. cd android                  (الذهاب لمجلد Android)
  5. ./gradlew assembleDebug     (بناء APK)

📍 الملف النهائي:
   android/app/build/outputs/apk/debug/app-debug.apk

🎯 أو شغّل المباشرة:
   Windows: build-apk.bat
   Mac/Linux: ./build-apk.sh
`);
