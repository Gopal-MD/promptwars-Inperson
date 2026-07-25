// LocalStorage helpers for RecoverAI

const KEYS = {
  SOBER_DATE: 'recoverai_sober_date',
  MOOD_LOGS: 'recoverai_mood_logs',
  SESSION_HISTORY: 'recoverai_session_history',
  CAREGIVER_CONTACT: 'recoverai_caregiver_contact'
};

// 1. Sober Date & Clean Days Milestones
export const getSoberDate = () => {
  const dateStr = localStorage.getItem(KEYS.SOBER_DATE);
  if (!dateStr) {
    // Default to today if not set
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(KEYS.SOBER_DATE, today);
    return today;
  }
  return dateStr;
};

export const setSoberDate = (dateStr) => {
  localStorage.setItem(KEYS.SOBER_DATE, dateStr);
};

export const getSoberDaysCount = () => {
  const soberDateStr = getSoberDate();
  const soberDate = new Date(soberDateStr);
  const today = new Date();
  
  // Reset hours to compare pure days
  soberDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today - soberDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If date is in the future, return 0
  if (today < soberDate) return 0;
  return diffDays;
};

// 2. Mood Logger
export const getMoodLogs = () => {
  const logs = localStorage.getItem(KEYS.MOOD_LOGS);
  return logs ? JSON.parse(logs) : [];
};

export const addMoodLog = (score, note = '') => {
  const logs = getMoodLogs();
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Overwrite today's log if it already exists, or append new one
  const existingIndex = logs.findIndex(log => log.date === todayStr);
  const newLog = { date: todayStr, score: Number(score), note };
  
  if (existingIndex !== -1) {
    logs[existingIndex] = newLog;
  } else {
    logs.push(newLog);
  }
  
  // Keep last 30 logs
  if (logs.length > 30) {
    logs.shift();
  }
  
  // Clear recommendation dismissal state
  localStorage.removeItem('recoverai_dismiss_mood_suggestion');
  
  localStorage.setItem(KEYS.MOOD_LOGS, JSON.stringify(logs));
  return logs;
};

export const hasConsecutiveLowMoods = () => {
  const logs = getMoodLogs();
  if (!logs || logs.length < 3) return false;
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let count = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (Number(sorted[i].score) < 3) {
      count++;
      if (count >= 3) return true;
    } else {
      count = 0;
    }
  }
  return false;
};

// 3. Saved AI Assistant Sessions
export const getSessionHistory = () => {
  const history = localStorage.getItem(KEYS.SESSION_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const saveSession = (session) => {
  const history = getSessionHistory();
  const newSession = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...session // { transcript, responseText, parsedResponse, mood }
  };
  
  history.unshift(newSession); // Newest first
  
  // Keep last 50 sessions
  if (history.length > 50) {
    history.pop();
  }
  
  localStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(history));
  return history;
};

export const deleteSession = (id) => {
  const history = getSessionHistory();
  const filtered = history.filter(session => session.id !== id);
  localStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(filtered));
  return filtered;
};

// 4. Caregiver Contact Info
export const getCaregiverContact = () => {
  const contact = localStorage.getItem(KEYS.CAREGIVER_CONTACT);
  return contact ? JSON.parse(contact) : { name: 'Dad', relation: 'Father', phone: '555-0199' };
};

export const setCaregiverContact = (contact) => {
  // contact: { name, relation, phone }
  localStorage.setItem(KEYS.CAREGIVER_CONTACT, JSON.stringify(contact));
};
