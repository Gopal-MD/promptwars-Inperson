import { describe, test, expect, beforeEach } from 'vitest';
import { 
  saveSession, 
  getSessionHistory, 
  deleteSession,
  getCaregiverContact, 
  setCaregiverContact, 
  getMoodLogs, 
  addMoodLog,
  setSoberDate,
  getSoberDaysCount,
  hasConsecutiveLowMoods
} from './localStorage';

describe('localStorage.js Utils Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveSession persists and is retrievable', () => {
    const session = {
      transcript: 'I need help',
      responseText: 'Here is help',
      parsedResponse: {},
      mood: 'anxious'
    };
    const history = saveSession(session);
    expect(history.length).toBe(1);
    expect(history[0].transcript).toBe('I need help');
    expect(history[0].id).toBeDefined();

    const retrieved = getSessionHistory();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].transcript).toBe('I need help');
  });

  test('getCaregiverContact returns a safe default when nothing is stored', () => {
    const defaultContact = getCaregiverContact();
    expect(defaultContact).toBeDefined();
    expect(defaultContact.name).toBe('Dad');
    expect(defaultContact.relation).toBe('Father');
    expect(defaultContact.phone).toBe('555-0199');
  });

  test('setCaregiverContact persists caregiver contact', () => {
    const contact = { name: 'Mom', relation: 'Mother', phone: '555-0200' };
    setCaregiverContact(contact);
    const retrieved = getCaregiverContact();
    expect(retrieved.name).toBe('Mom');
    expect(retrieved.relation).toBe('Mother');
    expect(retrieved.phone).toBe('555-0200');
  });

  test('addMoodLog accumulates mood logs correctly and caps at 30', () => {
    let logs = getMoodLogs();
    expect(logs.length).toBe(0);

    logs = addMoodLog(4, 'Feeling good');
    expect(logs.length).toBe(1);
    expect(logs[0].score).toBe(4);
    expect(logs[0].note).toBe('Feeling good');

    const testLogs = [];
    for (let i = 0; i < 30; i++) {
      testLogs.push({ date: `2026-06-${String(i + 1).padStart(2, '0')}`, score: 3, note: `Log ${i}` });
    }
    localStorage.setItem('recoverai_mood_logs', JSON.stringify(testLogs));

    const finalLogs = addMoodLog(3, 'Today log');
    expect(finalLogs.length).toBe(30);
  });

  test('setCaregiverContact successfully updates multiple times', () => {
    const contact1 = { name: 'Sister', relation: 'Sibling', phone: '555-0300' };
    setCaregiverContact(contact1);
    expect(getCaregiverContact().name).toBe('Sister');

    const contact2 = { name: 'Sponsor Bob', relation: 'Sponsor', phone: '555-0400' };
    setCaregiverContact(contact2);
    const retrieved = getCaregiverContact();
    expect(retrieved.name).toBe('Sponsor Bob');
    expect(retrieved.relation).toBe('Sponsor');
    expect(retrieved.phone).toBe('555-0400');
  });

  // --- getSoberDaysCount ---
  test('getSoberDaysCount: returns correct day count for a past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    const pastStr = past.toISOString().split('T')[0];
    setSoberDate(pastStr);
    expect(getSoberDaysCount()).toBe(10);
  });

  test('getSoberDaysCount: returns 0 when sobriety date is in the future', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    setSoberDate(future.toISOString().split('T')[0]);
    expect(getSoberDaysCount()).toBe(0);
  });

  test('getSoberDaysCount: returns 0 when sobriety date is today', () => {
    const today = new Date().toISOString().split('T')[0];
    setSoberDate(today);
    expect(getSoberDaysCount()).toBe(0);
  });

  // --- hasConsecutiveLowMoods ---
  test('hasConsecutiveLowMoods: returns true for 3+ consecutive low scores', () => {
    const logs = [
      { date: '2026-07-20', score: 2, note: '' },
      { date: '2026-07-21', score: 1, note: '' },
      { date: '2026-07-22', score: 2, note: '' },
    ];
    localStorage.setItem('recoverai_mood_logs', JSON.stringify(logs));
    expect(hasConsecutiveLowMoods()).toBe(true);
  });

  test('hasConsecutiveLowMoods: returns false when a high score breaks the streak', () => {
    const logs = [
      { date: '2026-07-20', score: 2, note: '' },
      { date: '2026-07-21', score: 4, note: '' }, // breaks streak
      { date: '2026-07-22', score: 1, note: '' },
      { date: '2026-07-23', score: 2, note: '' },
    ];
    localStorage.setItem('recoverai_mood_logs', JSON.stringify(logs));
    expect(hasConsecutiveLowMoods()).toBe(false);
  });

  test('hasConsecutiveLowMoods: returns false when fewer than 3 logs exist', () => {
    const logs = [
      { date: '2026-07-22', score: 1, note: '' },
      { date: '2026-07-23', score: 2, note: '' },
    ];
    localStorage.setItem('recoverai_mood_logs', JSON.stringify(logs));
    expect(hasConsecutiveLowMoods()).toBe(false);
  });

  // --- Session History ---
  test('saveSession caps history at 50 and drops the oldest session', () => {
    // Pre-seed 50 sessions
    const existing = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      timestamp: new Date().toISOString(),
      transcript: `session ${i}`,
      responseText: '',
      parsedResponse: {},
      mood: 'calm'
    }));
    localStorage.setItem('recoverai_session_history', JSON.stringify(existing));

    saveSession({ transcript: 'new session', responseText: '', parsedResponse: {}, mood: 'anxious' });
    const history = getSessionHistory();
    expect(history.length).toBe(50);
    // newest first — the new session should be at index 0
    expect(history[0].transcript).toBe('new session');
  });

  test('deleteSession removes the correct session by id', async () => {
    localStorage.clear(); // isolate from previous test state

    // Save first session; history = ['first'] — capture its id
    const history1 = saveSession({ transcript: 'first', responseText: '', parsedResponse: {}, mood: 'calm' });
    const idToDelete = history1[0].id;

    // Delay 2ms so Date.now() produces a different id for the second session
    await new Promise(r => setTimeout(r, 2));

    // Save second session; history = ['second', 'first'] (newest first)
    saveSession({ transcript: 'second', responseText: '', parsedResponse: {}, mood: 'anxious' });

    // Both sessions should now exist
    expect(getSessionHistory().length).toBe(2);

    // Delete 'first' — one entry should remain: 'second'
    const afterDelete = deleteSession(idToDelete);
    expect(afterDelete.find(s => s.id === idToDelete)).toBeUndefined();
    expect(afterDelete.length).toBe(1);
    expect(afterDelete[0].transcript).toBe('second');
  });
});
