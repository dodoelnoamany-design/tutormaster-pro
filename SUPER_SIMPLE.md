# 🏃 طريقة سريعة جداً (5 أسطر فقط!)

## ⚡ الآمر الواحد الذي يبني كل شيء:

### على Windows:
```bash
npm run build && npx cap add android && cd android && gradlew.bat assembleDebug
```

### على Mac/Linux:
```bash
npm run build && npx cap add android && cd android && ./gradlew assembleDebug
```

---

## 🎯 ما الذي سيحدث:

```
1️⃣  npm run build
    ↓ ينشئ مجلد dist/

2️⃣  npx cap add android
    ↓ ينشئ مجلد android/

3️⃣  cd android
    ↓ يدخل مجلد android/

4️⃣  gradlew assembleDebug
    ↓ ينشئ APK!

✅ APK يكون في:
   android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 النتيجة:

```
✅ حجم: 15-20 MB
✅ بدون إنترنت: 100%
✅ جاهز للتثبيت على الهاتف
✅ كل البيانات محلية
```

---

## 🔗 الملفات الوحيدة التي تحتاج لرفعها (اختياري):

```
src/
public/
package.json
tsconfig.json
vite.config.ts
index.html
manifest.json
sw.js
capacitor.config.ts
```

**ارفعها على Vercel أو Netlify، ثم:**
```
https://www.pwabuilder.com/
أدخل الرابط → Android → حمّل APK
```

---

**هذا كل شيء!** 🚀
