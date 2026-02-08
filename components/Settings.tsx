import React, { useRef } from 'react';
import { useSettings } from '../themeStore';

const Settings: React.FC = () => {
  const {
    theme, setTheme, soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled,
    customColors, setCustomColors, resetCustomColors,
    exportData, importData, resetToDefaults
  } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorOptions = [
    { label: 'أزرق (افتراضي)', colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#f59e0b' } },
    { label: 'أرجواني', colors: { primary: '#a855f7', secondary: '#7e22ce', accent: '#ec4899' } },
    { label: 'أخضر', colors: { primary: '#10b981', secondary: '#059669', accent: '#f59e0b' } },
    { label: 'أحمر', colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fbbf24' } },
    { label: 'سماوي', colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#fbbf24' } },
  ];

  const handleExport = () => {
    const data = exportData();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `tutor-backup-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        alert('تم استيراد البيانات بنجاح');
      } else {
        alert('فشل استيراد البيانات. تأكد من صيغة الملف');
      }
    };
    reader.readAsText(file);
  };

  const playSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <div className="space-y-6 page-transition pb-24">
      <div className="px-2 space-y-1">
        <h2 className="text-2xl font-black text-white">الإعدادات</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">خيارات التطبيق والتخصيص</p>
      </div>

      {/* المظهر */}
      <div className="px-2 space-y-3">
        <div className="glass-3d p-5 rounded-[2rem] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white">المظهر (Theme)</h3>
              <p className="text-[11px] text-slate-500 font-bold">اختر بين الوضع الليلي والنهاري</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all border ${
                theme === 'dark'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                الليل
              </div>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all border ${
                theme === 'light'
                  ? 'bg-amber-500 border-amber-300 text-slate-900 shadow-lg shadow-amber-800/50'
                  : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                النهار
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* تخصيص الألوان */}
      <div className="px-2 space-y-3">
        <div className="glass-3d p-5 rounded-[2rem] border-white/5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white">تخصيص الألوان</h3>
            <p className="text-[11px] text-slate-500 font-bold">اختر مجموعة ألوان مختلفة</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setCustomColors(opt.colors)}
                className="p-3 rounded-xl border-2 transition-all hover:border-white/30"
                style={{
                  borderColor: customColors.primary === opt.colors.primary ? opt.colors.primary : 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: opt.colors.primary }} />
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: opt.colors.secondary }} />
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: opt.colors.accent }} />
                  </div>
                  <span className="text-[10px] font-black text-white">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={resetCustomColors}
            className="w-full py-2 px-4 rounded-xl font-black text-sm text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-white/10 transition-all"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* الإشعارات والصوت */}
      <div className="px-2 space-y-3">
        <div className="glass-3d p-5 rounded-[2rem] border-white/5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">الإشعارات</h3>
                <p className="text-[10px] text-slate-500 font-bold">إشعارات قبل الحصة بـ 10 دقائق</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">المؤثرات الصوتية</h3>
                <p className="text-[10px] text-slate-500 font-bold">تشغيل أصوات خفيفة</p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {soundEnabled && (
              <button
                onClick={playSound}
                className="w-full py-2 px-4 rounded-xl font-black text-sm text-white bg-blue-600/50 hover:bg-blue-600 border border-blue-400/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707a1 1 0 011.414 0l4.707 4.707H20a1 1 0 011 1v6a1 1 0 01-1 1h-1.586l-4.707 4.707a1 1 0 01-1.414 0L5.586 15z" />
                </svg>
                تجربة الصوت
              </button>
            )}
          </div>
        </div>
      </div>

      {/* النسخ الاحتياطي */}
      <div className="px-2 space-y-3">
        <div className="glass-3d p-5 rounded-[2rem] border-white/5 space-y-4">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-black text-white">النسخ الاحتياطي والاستعادة</h3>
            <p className="text-[11px] text-slate-500 font-bold">احفظ بيانات تطبيقك أو استعدها</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تحميل النسخة الاحتياطية
            </button>

            <button
              onClick={handleImportClick}
              className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-400/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              استيراد النسخة الاحتياطية
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* حذف البيانات */}
      <div className="px-2 space-y-3">
        <div className="glass-3d p-5 rounded-[2rem] border-white/5 space-y-4">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-black text-white">إدارة البيانات</h3>
            <p className="text-[11px] text-slate-500 font-bold">حذف أو إعادة تعيين التطبيق</p>
          </div>

          <button
            onClick={resetToDefaults}
            className="w-full py-3 px-4 rounded-xl font-black text-sm text-red-400 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف جميع البيانات
          </button>
        </div>
      </div>

      {/* معلومات */}
      <div className="px-2 pb-4">
        <div className="glass-3d p-5 rounded-[2rem] border border-blue-500/10 bg-blue-600/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-300 font-black">معلومات التطبيق</p>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                جميع البيانات تُحفظ محلياً على جهازك. استخدم النسخ الاحتياطية للحفاظ على بيانات للطوارئ. جميع المؤثرات الصوتية خفيفة وآمنة.
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-3">تم عمل التطبيق بواسطة محمد النعماني</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
