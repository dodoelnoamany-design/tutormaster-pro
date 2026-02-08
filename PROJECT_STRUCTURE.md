# 📁 بنية المشروع - شرح شامل

## 🗂️ هيكل المجلدات

```
tutormaster-pro/
├── components/                  # مكونات React
│   ├── AppointmentsSchedule.tsx  # ✨ محدّث - إضافة تحكم الزوم
│   ├── BottomNav.tsx            # ✨ محدّث - إضافة زر الإعدادات
│   ├── Dashboard.tsx
│   ├── DailySummaryModal.tsx
│   ├── FinanceReport.tsx
│   ├── Header.tsx
│   ├── StudentList.tsx
│   ├── SessionList.tsx
│   ├── WeeklySchedule.tsx
│   └── Settings.tsx             # 🆕 صفحة الإعدادات الجديدة
│
├── App.tsx                      # ✨ محدّث - إضافة SettingsProvider
├── index.tsx                    # نقطة الدخول الرئيسية
├── index.html                   # ✨ محدّث - إضافة رابط styles.css
├── store.tsx                    # إدارة البيانات (AppContext)
├── themeStore.tsx               # 🆕 إدارة المظهر والإعدادات
├── types.ts                     # نماذج البيانات (Types)
├── sw.js                        # Service Worker للعمل الأوفلاين
├── styles.css                   # 🆕 أنماط الوضع النهاري
├── manifest.json                # ✨ إعدادات التطبيق الويب التقدمة
├── package.json                 # ✨ محدّث - تحديث الإصدار
├── vite.config.ts              # ✨ محدّث - إضافة تحسينات البناء
├── tsconfig.json                # إعدادات TypeScript
├── QUICK_START.md              # 🆕 دليل البدء السريع
├── FEATURES.md                 # 🆕 شرح المميزات
├── ANDROID_BUILD.md            # 🆕 تعليمات تحويل لـ APK
└── TESTING_CHECKLIST.md        # 🆕 قائمة اختبار شاملة

📁 التطوير:
├── dist/                        # المجلد الناتج من البناء
└── node_modules/               # المكتبات المثبتة
```

---

## 📄 شرح الملفات الجديدة والمعدلة

### 🆕 ملفات جديدة كلياً

#### 1. **themeStore.tsx**
```typescript
// إدارة المظهر والإعدادات المتقدمة
- useSettings() Hook للوصول للإعدادات
- setTheme() لتبديل بين Dark/Light
- setScheduleZoom() لتحكم الزوم
- exportData() لتصدير النسخة الاحتياطية
- importData() لاستيراد النسخة الاحتياطية
- resetToDefaults() لحذف البيانات
```

**الاستخدام:**
```tsx
import { useSettings } from '../themeStore';

const MyComponent = () => {
  const { theme, setTheme, scheduleZoom, setScheduleZoom } = useSettings();
  // استخدم هنا
};
```

#### 2. **components/Settings.tsx**
```typescript
// صفحة الإعدادات الكاملة
- تبديل المظهر (Dark/Light)
- التحكم في الزوم
- تصدير النسخة الاحتياطية
- استيراد النسخة الاحتياطية
- حذف البيانات الآمن
- معلومات المساعدة
```

#### 3. **styles.css**
```css
/* أنماط الوضع النهاري الكامل */
html.light {
  /* تعريفات الألوان الفاتحة */
  /* أنماط الخلفيات */
  /* تنسيق النصوص */
  /* ألوان الحدود والأزرار */
}
```

#### 4. **QUICK_START.md**
دليل سريع للبدء الفوري مع الأوامر والخطوات.

#### 5. **FEATURES.md**
شرح تفصيلي لجميع المميزات الجديدة.

#### 6. **ANDROID_BUILD.md**
تعليمات تفصيلية لتحويل التطبيق إلى APK بثلاث طرق مختلفة.

#### 7. **TESTING_CHECKLIST.md**
قائمة اختبار شاملة للتحقق من عمل جميع الميزات.

---

### ✨ ملفات معدلة

#### **App.tsx**
```diff
+ import { SettingsProvider } from './themeStore';
+ import Settings from './components/Settings';

- type 'dashboard' | 'students' | 'sessions' | 'appointments' | 'finance'
+ type 'dashboard' | 'students' | 'sessions' | 'appointments' | 'finance' | 'settings'

- <AppProvider>
+ <SettingsProvider>
+   <AppProvider>
+     ...
+   </AppProvider>
+ </SettingsProvider>

+ case 'settings': return <Settings />;
```

#### **components/AppointmentsSchedule.tsx**
```diff
+ import { useSettings } from '../themeStore';
+ const { scheduleZoom, setScheduleZoom } = useSettings();
+ const [showZoomMenu, setShowZoomMenu] = useState(false);

+ // زر التحكم بالزوم
+ <button onClick={() => setShowZoomMenu(!showZoomMenu)}>
+   <svg>...</svg> {/* أيقونة العدسة */}
+ </button>

+ // قائمة الزوم المنبثقة
+ {showZoomMenu && (
+   <div className="...">
+     <input type="range" value={scheduleZoom * 100} />
+     <button>صغر / عادي / كبر</button>
+   </div>
+ )}

+ // تطبيق الزوم على الجدول
+ style={{ borderSpacing: `${6 * scheduleZoom}px` }}
```

#### **components/BottomNav.tsx**
```diff
- 5 tabs قديمة
+ 6 tabs جديدة
+ اضافة { id: 'settings', label: 'الإعدادات', icon: '...' }

- interface BottomNavProps {
+ interface BottomNavProps {
    activeTab: '...' | 'settings';
```

#### **index.html**
```diff
+ <link rel="stylesheet" href="/styles.css">
```

#### **package.json**
```diff
- "version": "0.0.0"
+ "version": "1.0.0"

- // لا يوجد description
+ "description": "تطبيق متقدم لإدارة الدروس..."
+ "author": "TutorMaster Team"
```

#### **vite.config.ts**
```diff
+ build: {
+   outDir: 'dist',
+   sourcemap: false,
+   minify: 'terser',
+   rollupOptions: { manualChunks: { ... } }
+ }
```

---

## 🔄 تدفق البيانات

### الحالة (State Management):
```
┌─────────────────────────────────────────┐
│  SettingsProvider (themeStore.tsx)      │ ← المظهر والإعدادات
├─────────────────────────────────────────┤
│  AppProvider (store.tsx)                │ ← البيانات الرئيسية
├─────────────────────────────────────────┤
│  React Components                       │ ← واجهة المستخدم
└─────────────────────────────────────────┘

Config Flow:
themeStore → useSettings() → {theme, scheduleZoom, ...}
    ↓
localStorage (tutor_theme, tutor_schedule_zoom)
    ↓
HTML element class (light/dark)
    ↓
CSS rules (styles.css)
```

### تدفق النسخ الاحتياطية:
```
Settings Component
    ↓
exportData() → JSON string
    ↓
localStorage (students + sessions + settings)
    ↓
Package as downloadable file
    ↓
User downloads backup

---

importData() ← JSON file
    ↓
Parse & validate
    ↓
Update localStorage
    ↓
Reload page
```

---

## 💾 البيانات المحفوظة

### localStorage Keys:
```javascript
// البيانات الأساسية
'tutor_students_v3'      // جميع الطلاب
'tutor_sessions_v3'      // جميع الحصص

// الإعدادات
'tutor_theme'            // 'dark' أو 'light'
'tutor_schedule_zoom'    // 0.6 إلى 2.0
'app_initialized'        // تم تثبيت Service Worker
```

### حجم التخزين:
```
- الطالب الواحد: ~300 bytes
- الحصة الواحدة: ~150 bytes
- الإعدادات: ~100 bytes

مثال: 50 طالب × 30 حصة ≈ 20 KB
(localStorage يدعم عادة 5-10 MB)
```

---

## 🔐 الاتصالات والأمان

### Service Worker:
```javascript
// سياسة التخزين المؤقت
Cache-First Strategy:
1. Check cache
2. If not found → fetch from network
3. Store in cache
4. If network fails → return cached version
```

### لا توجد اتصالات خارجية:
- لا APIs خارجية
- لا خوادم بيانات
- لا تتبع مستخدمين
- بيانات محلية فقط

---

## 📦 الاعتماديات

### الحالية:
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

### لم نضف أي مكتبات خارجية جديدة:
- التطبيق خفيف وسريع
- لا توابع إضافية
- حجم النهائي صغير

---

## 🚀 عملية البناء

### التطويري:
```bash
npm run dev
# Vite Dev Server على port 3000
# Hot Module Replacement (HMR) مفعّل
```

### الإنتاج:
```bash
npm run build
# Output: dist/
# Minified & optimized
# Ready for deployment
```

### البناء للـ APK:
```bash
npm run build  # أنتج dist/
cordova/capacitor  # تحويل إلى APK
```

---

## ✅ معايير الجودة

### أداء:
- ✅ لا توجد تسريبات ذاكرة
- ✅ إعادة render محسّنة
- ✅ CSS محسّن
- ✅ JavaScript مضغوط

### التوافقية:
- ✅ Chrome, Firefox, Safari
- ✅ Android, iOS, Desktop
- ✅ RTL (Right-to-Left) صحيح

### الوصولية:
- ✅ ألوان واضحة
- ✅ حجم خط قابل للقراءة
- ✅ تباين كافٍ

---

## 🔄 رحلة المستخدم

```
1. تثبيت أول مرة
   ↓
2. تحميل Service Worker
   ↓
3. اختيار المظهر (Light/Dark)
   ↓
4. إضافة طلاب ومواعيد
   ↓
5. تعديل زوم الجدول حسب الحاجة
   ↓
6. حفظ نسخة احتياطية دورية
   ↓
7. استخدام بدون إنترنت بشكل كامل
   ↓
8. تصدير النسخة الاحتياطية للهاتف
```

---

## 📚 المراجع المفيدة

- **React Hooks:** `useState`, `useContext`, `useEffect`
- **TypeScript:** Types, Interfaces, Generics
- **Service Worker API:** Cache API, Fetch API
- **LocalStorage API:** getItem, setItem, removeItem
- **Vite:** Build optimization, HMR

---

**آخر تحديث:** فبراير 2026
**الإصدار:** 1.0.0
**حالة التوثيق:** ✅ كامل
