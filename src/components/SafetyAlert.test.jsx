import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SafetyAlert, { checkSafetyDanger } from './SafetyAlert';

describe('SafetyAlert Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders safety alert modal with correct content', () => {
    render(<SafetyAlert triggerText="I want to overdose" onDismiss={() => {}} />);
    expect(screen.getByText(/Safety Intercept Activated/i)).toBeDefined();
    expect(screen.getByText(/Crisis keyword detected/i)).toBeDefined();
    expect(screen.getByText(/Call Emergency \(911\)/i)).toBeDefined();
    expect(screen.getByText(/Call Crisis Line \(988\)/i)).toBeDefined();
  });

  test('displays caregiver contact section', () => {
    render(<SafetyAlert triggerText="test" onDismiss={() => {}} />);
    expect(screen.getByText(/Primary Caregiver Alert/i)).toBeDefined();
  });

  test('checkSafetyDanger detects English keywords', () => {
    expect(checkSafetyDanger('I want to overdose')).toBe(true);
    expect(checkSafetyDanger('suicide thoughts')).toBe(true);
    expect(checkSafetyDanger('I am feeling safe')).toBe(false);
  });

  test('checkSafetyDanger handles empty/null input', () => {
    expect(checkSafetyDanger('')).toBe(false);
    expect(checkSafetyDanger(null)).toBe(false);
    expect(checkSafetyDanger(undefined)).toBe(false);
  });
});
