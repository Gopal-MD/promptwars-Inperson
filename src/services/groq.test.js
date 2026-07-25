import { describe, test, expect } from 'vitest';
import { parseRecoveryResponse, parseCaregiverResponse } from './groq';

describe('groq.js Parser Tests', () => {
  test('parseRecoveryResponse: correct extraction when all tags present', () => {
    const rawText = `
      [EMOTIONAL_SUPPORT]
      We support you.
      [IMMEDIATE_ACTION]
      Breathe deeply.
      [SAFETY_ADVICE]
      Seek help.
      [ENCOURAGING_MESSAGE]
      You got this.
      [EDUCATIONAL_TIP]
      Dopamine heals.
    `;
    const parsed = parseRecoveryResponse(rawText);
    expect(parsed.emotionalSupport).toBe('We support you.');
    expect(parsed.immediateAction).toBe('Breathe deeply.');
    expect(parsed.safetyAdvice).toBe('Seek help.');
    expect(parsed.encouragingMessage).toBe('You got this.');
    expect(parsed.educationalTip).toBe('Dopamine heals.');
  });

  test('parseRecoveryResponse: graceful fallback behavior when tags are missing or malformed', () => {
    const rawText = `Some random text without tags`;
    const parsed = parseRecoveryResponse(rawText);
    expect(parsed.emotionalSupport).toBe(rawText);
    expect(parsed.immediateAction).toContain('breath');
    expect(parsed.safetyAdvice).toContain('911');
  });

  test('parseCaregiverResponse: correct extraction when all tags present', () => {
    const rawText = `
      [COMMUNICATION]
      Talk slowly.
      [AVOID]
      Shame.
      [REINFORCEMENT]
      Praise.
      [WARNING_SIGNS]
      Isolation.
      [EMERGENCY_ADVICE]
      Call 911.
    `;
    const parsed = parseCaregiverResponse(rawText);
    expect(parsed.communication).toBe('Talk slowly.');
    expect(parsed.avoid).toBe('Shame.');
    expect(parsed.reinforcement).toBe('Praise.');
    expect(parsed.warningSigns).toBe('Isolation.');
    expect(parsed.emergencyAdvice).toBe('Call 911.');
  });

  test('parseCaregiverResponse: graceful fallback behavior when tags are missing', () => {
    const rawText = `Standard advice text`;
    const parsed = parseCaregiverResponse(rawText);
    expect(parsed.communication).toBe(rawText);
    expect(parsed.avoid).toBe('');
  });
});
