import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import Home from './pages/Home';
import RecoveryAssistant from './pages/RecoveryAssistant';
import EmergencyScript from './pages/EmergencyScript';

// Mock Web Speech Synthesis to avoid test environment errors
global.SpeechSynthesisUtterance = vi.fn();
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  speaking: false,
  getVoices: vi.fn().mockReturnValue([])
};

// Mock Web Speech Recognition
global.webkitSpeechRecognition = vi.fn().mockImplementation(function() {
  this.start = vi.fn();
  this.stop = vi.fn();
  this.continuous = true;
  this.interimResults = true;
  this.lang = 'en-US';
  this.onresult = vi.fn();
  this.onerror = vi.fn();
  this.onend = vi.fn();
});

describe('Nivara AI Render Tests', () => {
  test('Home page renders and shows main dashboard metrics and options', () => {
    render(<Home setCurrentPage={() => {}} />);
    expect(screen.getByText(/Welcome to Nivara AI/i)).toBeDefined();
    expect(screen.getByText(/Talk to AI/i)).toBeDefined();
    expect(screen.getByText(/Emergency Script/i)).toBeDefined();
  });

  test('Recovery Assistant page renders correctly and has active voice microphone', () => {
    render(<RecoveryAssistant />);
    expect(screen.getByText(/Recovery Assistant/i)).toBeDefined();
    expect(screen.getByText(/Tap to Speak/i)).toBeDefined();
  });

  test('Emergency Script page renders and displays messaging options', () => {
    render(<EmergencyScript />);
    expect(screen.getByText(/Emergency Script Generator/i)).toBeDefined();
    expect(screen.getByText(/Copy Script/i)).toBeDefined();
  });

  test('App main shell mounts and loads Layout navbar', () => {
    render(<App />);
    expect(screen.getAllByText(/Nivara AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Settings/i)).toBeDefined();
  });
});
