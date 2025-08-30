import '@testing-library/jest-dom';
import { act } from 'react';

// Make React.act available for React Testing Library
global.React = { act };
global.IS_REACT_ACT_ENVIRONMENT = true;

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