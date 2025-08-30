import '@testing-library/jest-dom';
import * as React from 'react';

// Make React available globally for testing-library
globalThis.React = React;
global.React = React;

// Mock IntersectionObserver for jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};