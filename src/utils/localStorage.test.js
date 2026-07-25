import { describe, test, expect, beforeEach } from 'vitest';
import { 
  saveSession, 
  getSessionHistory, 
  getCaregiverContact, 
  setCaregiverContact, 
  getMoodLogs, 
  addMoodLog 
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
});
