
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { DayTime, Student } from '../types';

const StudentList: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, updateFixedSchedule } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    level: '', 
    parentName: '',
    parentPhone: '',
    monthlyPrice: 600, 
    fixedSchedule: [] as DayTime[] 
  });
  
  const [calculatedPrice, setCalculatedPrice] = useState(150);
  const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Modal for selecting time when clicking a fixed day
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [modalTime, setModalTime] = useState<string>('16:00');
  const [modalDateStr, setModalDateStr] = useState<string>('');

  const sessionsPerWeek = formData.fixedSchedule.length;

  useEffect(() => {
    const totalSessionsMonth = sessionsPerWeek * 4;
    setCalculatedPrice(totalSessionsMonth > 0 ? Math.round(formData.monthlyPrice / totalSessionsMonth) : 0);
  }, [formData.monthlyPrice, sessionsPerWeek]);

  const openAdd = () => {
    setEditingStudent(null);
    setFormData({ 
      name: '', phone: '', level: '', parentName: '', parentPhone: '',
      monthlyPrice: 600, fixedSchedule: [] 
    });
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({ 
      name: s.name, 
      phone: s.phone || '', 
      level: s.level || '', 
      parentName: s.parentName || '',
      parentPhone: s.parentPhone || '',
      monthlyPrice: s.monthlyPrice, 
      fixedSchedule: s.fixedSchedule 
    });
    setShowModal(true);
  };

  const toggleDay = (dayIndex: number) => {
    setFormData(prev => {
      const exists = prev.fixedSchedule.find(d => d.day === dayIndex);
      if (exists) {
        return { ...prev, fixedSchedule: prev.fixedSchedule.filter(d => d.day !== dayIndex) };
      } else {
        return { ...prev, fixedSchedule: [...prev.fixedSchedule, { day: dayIndex, time: '16:00' }] };
      }
    });
  };

  const updateTime = (dayIndex: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      fixedSchedule: prev.fixedSchedule.map(d => d.day === dayIndex ? { ...d, time } : d)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
        sessionsPerWeek,
        sessionPrice: calculatedPrice
      });
    } else {
      addStudent({ 
        ...formData, 
        sessionsPerWeek,
        sessionPrice: calculatedPrice, 
        paidAmount: 0 
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 page-transition pb-20">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">إدارة الطلاب</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">إجمالي المسجلين: {students.length}</p>
        </div>
        <button onClick={openAdd} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="grid gap-4">
        {students.length === 0 ? (
          <div className="text-center py-20 glass-3d rounded-[2.5rem] border-dashed border-slate-800">
            <p className="text-slate-500 font-bold">لا يوجد طلاب مضافين حالياً</p>
          </div>
        ) : (
          students.map(s => (
            <div key={s.id} className="glass-3d p-5 rounded-3xl relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg leading-tight">{s.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    {s.level || 'بدون مستوى'} • {s.sessionsPerWeek} حصص أسبوعياً
                  </p>
                  {s.parentName && <p className="text-[9px] text-blue-400 font-bold mt-1">ولي الأمر: {s.parentName}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.fixedSchedule.map(d => (
                        <button key={d.day} onClick={() => openTimePickerForFixed(s, d.day, d.time)} className="bg-blue-500/10 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded border border-blue-500/20">
                          {daysAr[d.day]} @ {d.time}
                        </button>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 mr-4">
                  <button onClick={() => openEdit(s)} className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-blue-400 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => confirm('هل أنت متأكد من حذف الطالب؟') && deleteStudent(s.id)} className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
          <div className="glass-3d w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-3xl my-10">
            <h3 className="text-xl font-black text-white mb-6 text-center">
              {editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none text-white font-bold" placeholder="اسم الطالب (إجباري)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold" placeholder="المستوى" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
                <input type="tel" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold" placeholder="هاتف الطالب" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold" placeholder="اسم ولي الأمر" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                <input type="tel" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-bold" placeholder="هاتف ولي الأمر" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
              </div>
              
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">اختر الأيام الثابتة</p>
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500/20">
                    {sessionsPerWeek} حصص/أسبوع
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {daysAr.map((d, i) => (
                    <button key={i} type="button" onClick={() => toggleDay(i)} className={`py-2 rounded-lg text-[9px] font-black transition-all ${formData.fixedSchedule.find(fd => fd.day === i) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-500'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                {formData.fixedSchedule.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.fixedSchedule.map(fd => (
                      <div key={fd.day} className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-300">{daysAr[fd.day]}</span>
                        <input type="time" className="bg-transparent text-white text-[10px] outline-none" value={fd.time} onChange={e => updateTime(fd.day, e.target.value)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold mr-2">إجمالي سعر الشهر (ج.م)</label>
                <div className="flex gap-2">
                  <input required type="number" className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white font-black" value={formData.monthlyPrice} onChange={e => setFormData({...formData, monthlyPrice: Number(e.target.value)})} />
                  <div className="bg-slate-950/50 border border-white/5 rounded-xl px-4 flex items-center justify-center min-w-[80px]">
                    <div className="text-center">
                      <p className="text-[8px] text-slate-500 font-bold">للحصة</p>
                      <p className="text-[10px] text-emerald-400 font-black">{calculatedPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
                {editingStudent ? 'تحديث البيانات ✅' : 'حفظ الطالب ✅'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full text-slate-500 py-2 font-bold text-sm">إلغاء</button>
            </form>
          </div>
        </div>
      )}
      {timeModalOpen && modalStudent && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
          <div className="glass-3d w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-3xl">
            <h3 className="text-xl font-black text-white mb-4 text-center">تحديد وقت لحصة {modalStudent.name}</h3>
            <p className="text-slate-500 text-sm text-center mb-4">اليوم: {daysAr[modalDay ?? 0]} — {modalDateStr}</p>
            <div className="space-y-4">
              <input type="time" value={modalTime} onChange={e => setModalTime(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none text-white font-bold" />
              <div className="flex gap-2">
                <button onClick={confirmTimeForFixed} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black">تأكيد وإضافة</button>
                <button onClick={() => setTimeModalOpen(false)} className="flex-1 bg-slate-900 text-slate-400 py-3 rounded-2xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  const getNextOccurrenceDate = (weekday: number) => {
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (d.getDay() === weekday) {
        // if same day but time passed, skip to next week
        return d;
      }
    }
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 7);
    return fallback;
  };

  function openTimePickerForFixed(s: Student, day: number, currentTime: string) {
    const next = getNextOccurrenceDate(day);
    setModalStudent(s);
    setModalDay(day);
    setModalTime(currentTime || '16:00');
    setModalDateStr(next.toISOString().split('T')[0]);
    setTimeModalOpen(true);
  }

  const confirmTimeForFixed = () => {
    if (!modalStudent || modalDay === null) return;
    // Update fixed schedule and upcoming sessions
    updateFixedSchedule(modalStudent.id, modalDay, modalTime);
    setTimeModalOpen(false);
    setModalStudent(null);
    setModalDay(null);
    setModalTime('16:00');
    setModalDateStr('');
  };

export default StudentList;
