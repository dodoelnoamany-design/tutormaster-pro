# 📱 دليل بناء APK خطوة بخطوة (بدون Android Studio)

## ✅ الطريقة الأسهل: استخدام Capacitor

---

## 🎯 المتطلبات الأساسية فقط:
```
✓ Node.js (v16+)
✓ Java JDK (مجاني)
✓ Gradle (سيتم تحميله تلقائياً)
```

---

## 📋 الخطوة 1: تحضير البيئة

### على Windows:
```powershell
# تثبيت OpenJDK (أداة برمجية)
choco install openjdk

# تحقق من التثبيت
java -version
```

### على Mac:
```bash
brew install openjdk
java -version
```

### على Linux:
```bash
sudo apt-get install openjdk-11-jdk
java -version
```

---

## 🔧 الخطوة 2: تحضير المشروع

### في مجلد المشروع:
```bash
# 1. بناء التطبيق
npm run build

# 2. تثبيت Capacitor
npm install @capacitor/core @capacitor/cli

# 3. إنشاء ملف الإعدادات
npx cap init "مدير الدروس" "com.tutormaster.pro" --web-dir dist
```

**الملفات المطلوبة للرفع:**
- 📁 `dist/` (مجلد البناء)
- 📄 `package.json`
- 📄 `capacitor.config.ts`

---

## 🚀 الخطوة 3: إضافة Android

```bash
# أضف منصة Android
npx cap add android

# نسّق الملفات
npx cap sync android
```

**الملفات التي تم إنشاؤها:**
- 📁 `android/` (مجلد Android)

---

## 🛠️ الخطوة 4: بناء APK

```bash
# اذهب لمجلد Android
cd android

# بناء APK (Debug)
./gradlew assembleDebug

# أو للإصدار النهائي (Release)
./gradlew assembleRelease
```

**موقع الملف النهائي:**
✅ `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📥 الحصول على الملف

```
android/
└── app/
    └── build/
        └── outputs/
            └── apk/
                └── debug/
                    └── app-debug.apk  ← هذا الملف!
```

---

## 🌐 الطريقة البديلة: PWA Builder (أسهل!)

### خطوات سهلة:

1. **انشر الموقع على Vercel:**
```bash
npm install -g vercel
vercel
```

2. **اذهب إلى:** https://www.pwabuilder.com/

3. **أدخل الرابط الذي حصلت عليه من Vercel**

4. **اضغط:** "Package your PWA" → Android

5. **حمّل APK مباشرة!**

---

## ✨ الخطوة 5: تحسينات مهمة

### تحديث `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tutormaster.pro',
  appName: 'مدير الدروس',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

### تحديث `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  }
})
```

---

## 🔑 ملفات المشروع المهمة للرفع:

إذا أردت رفع المشروع على موقع، ارفع فقط:

```
✅ src/          (الملفات المصدرية)
✅ public/       (الملفات العامة)
✅ dist/         (البناء النهائي)
✅ package.json
✅ tsconfig.json
✅ vite.config.ts
✅ capacitor.config.ts
✅ manifest.json
✅ sw.js         (Service Worker)

❌ node_modules/  (لا تحتاج)
❌ android/       (سيتم إنشاؤه تلقائياً)
```

---

## 🎯 الأوامر السريعة:

```bash
# بناء كامل من الصفر
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug

# على Mac/Linux
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug

# على Windows (PowerShell)
npm run build; npx cap sync android; cd android; .\gradlew.bat assembleDebug
```

---

## ✅ الفحص:

بعد الانتهاء:
```bash
# تحقق من وجود APK
ls android/app/build/outputs/apk/debug/

# أو على Windows
dir android\app\build\outputs\apk\debug\
```

---

## 🎨 معلومات إضافية:

```json
{
  "تطبيق": "مدير الدروس",
  "معرف التطبيق": "com.tutormaster.pro",
  "الحالة": "بدون إنترنت 100%",
  "الحجم التقريبي": "15-20 MB",
  "نسخة Android": "6.0+"
}
```

---

## 🚨 حل المشاكل الشائعة:

### المشكلة: Gradle لم يتم تثبيته
**الحل:**
```bash
npx cap open android
# سيتم التحميل تلقائياً عند الفتح الأول
```

### المشكلة: Java غير مثبت
**الحل:**
```bash
# تحقق من التثبيت
java -version

# أعد التثبيت
choco uninstall openjdk -y && choco install openjdk
```

### المشكلة: Gradle build failed
**الحل:**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## 🎉 النتيجة النهائية:

✅ APK جاهز 100% أوفلاين
✅ جميع البيانات محلية (localStorage)
✅ Service Worker نشط
✅ حجم صغير (~20 MB)
✅ يعمل على Android 6+

---

**الآن لديك APK جاهز للتثبيت على أي هاتف Android!** 🚀
