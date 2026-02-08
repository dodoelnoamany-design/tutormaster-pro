import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolSession } from './types';

interface SchoolContextType {
  schoolSessions: SchoolSession[];
  addSchoolSession: (session: Omit<SchoolSession, 'id' | 'createdAt'>) => void;
  updateSchoolSession: (session: SchoolSession) => void;
  deleteSchoolSession: (id: string) => void;
  getSchoolSessionByDay: (day: number) => SchoolSession[];
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolSessions, setSchoolSessions] = useState<SchoolSession[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tutor_school_sessions');
    if (saved) setSchoolSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tutor_school_sessions', JSON.stringify(schoolSessions));
  }, [schoolSessions]);

  const addSchoolSession = (data: Omit<SchoolSession, 'id' | 'createdAt'>) => {
    const newSession: SchoolSession = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setSchoolSessions(prev => [...prev, newSession]);
  };

  const updateSchoolSession = (session: SchoolSession) => {
    setSchoolSessions(prev => prev.map(s => s.id === session.id ? session : s));
  };

  const deleteSchoolSession = (id: string) => {
    setSchoolSessions(prev => prev.filter(s => s.id !== id));
  };

  const getSchoolSessionByDay = (day: number) => {
    return schoolSessions.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <SchoolContext.Provider value={{
      schoolSessions,
      addSchoolSession,
      updateSchoolSession,
      deleteSchoolSession,
      getSchoolSessionByDay,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool must be used within SchoolProvider');
  return context;
};
