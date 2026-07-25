import { describe, test, expect } from 'vitest';
import { checkSafetyDanger } from '../components/SafetyAlert';

describe('checkSafetyDanger Tests', () => {
  test('English keyword detected', () => {
    expect(checkSafetyDanger('I feel like suicide today')).toBe(true);
    expect(checkSafetyDanger('I had an overdose')).toBe(true);
  });

  test('Hindi keyword detected', () => {
    expect(checkSafetyDanger('मुझे सांस नहीं आ रही है')).toBe(true);
    expect(checkSafetyDanger('यह एक आत्महत्या का मामला है')).toBe(true);
  });

  test('Tamil keyword detected', () => {
    expect(checkSafetyDanger('தற்கொலை செய்யப்போகிறேன்')).toBe(true);
    expect(checkSafetyDanger('மீண்டும் போதை குடிக்க வேண்டும்')).toBe(true);
  });

  test('Telugu keyword detected', () => {
    expect(checkSafetyDanger('ఆత్మహత్య ఆలోచన వస్తుంది')).toBe(true);
    expect(checkSafetyDanger('నన్ను నేను చంపుకుంటాను')).toBe(true);
  });

  test('Case-insensitivity works', () => {
    expect(checkSafetyDanger('SUICIDE is not the answer')).toBe(true);
    expect(checkSafetyDanger('OVERDOSE')).toBe(true);
  });

  test('Empty or null input returns false', () => {
    expect(checkSafetyDanger('')).toBe(false);
    expect(checkSafetyDanger(null)).toBe(false);
    expect(checkSafetyDanger(undefined)).toBe(false);
  });

  test('Safe neutral text returns false', () => {
    expect(checkSafetyDanger('I want to go for a run in the park')).toBe(false);
    expect(checkSafetyDanger('I feel happy and calm')).toBe(false);
  });
});
