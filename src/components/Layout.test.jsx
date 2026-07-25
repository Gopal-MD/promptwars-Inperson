import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Layout from './Layout';

describe('Layout Component', () => {
  test('renders sidebar navigation with all menu items', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
    expect(screen.getByText(/Talk to AI/i)).toBeDefined();
    expect(screen.getByText(/Emergency Script/i)).toBeDefined();
    expect(screen.getByText(/Caregiver Support/i)).toBeDefined();
    expect(screen.getByText(/Learn FAQs/i)).toBeDefined();
    expect(screen.getByText(/Progress History/i)).toBeDefined();
  });

  test('renders sober days counter widget', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText(/Days Sobriety/i)).toBeDefined();
  });

  test('renders language selector', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText(/English/i)).toBeDefined();
  });

  test('renders settings button', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText(/Settings/i)).toBeDefined();
  });

  test('displays Nivara AI branding', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getAllByText(/Nivara AI/i).length).toBeGreaterThan(0);
  });
});
