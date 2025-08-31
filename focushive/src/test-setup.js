import '@testing-library/jest-dom';
import * as React from 'react';

// Make React and React.act available for React Testing Library
global.React = React;
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

// Mock IndexedDB for tests
class MockIDBRequest extends EventTarget {
  constructor() {
    super();
    this.result = null;
    this.error = null;
    this.readyState = 'pending';
  }

  succeed(result = null) {
    this.result = result;
    this.readyState = 'done';
    setTimeout(() => {
      const event = new Event('success');
      Object.defineProperty(event, 'target', { value: this });
      this.dispatchEvent(event);
      if (this.onsuccess) this.onsuccess(event);
    }, 0);
  }

  fail(error = new Error('Mock error')) {
    this.error = error;
    this.readyState = 'done';
    setTimeout(() => {
      const event = new Event('error');
      Object.defineProperty(event, 'target', { value: this });
      this.dispatchEvent(event);
      if (this.onerror) this.onerror(event);
    }, 0);
  }
}

class MockIDBObjectStore {
  constructor() {
    this.data = new Map();
    this.indexes = new Map();
  }

  add(data) {
    const request = new MockIDBRequest();
    setTimeout(() => {
      if (this.data.has(data.id)) {
        request.fail(new Error('Key already exists'));
      } else {
        this.data.set(data.id, data);
        request.succeed(data);
      }
    }, 0);
    return request;
  }

  getAll() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      request.succeed(Array.from(this.data.values()));
    }, 0);
    return request;
  }

  clear() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      this.data.clear();
      request.succeed();
    }, 0);
    return request;
  }

  count() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      request.succeed(this.data.size);
    }, 0);
    return request;
  }

  createIndex(name, keyPath, options) {
    this.indexes.set(name, { name, keyPath, options });
  }

  index(name) {
    return {
      getAll: () => {
        const request = new MockIDBRequest();
        setTimeout(() => {
          request.succeed(Array.from(this.data.values()));
        }, 0);
        return request;
      },
      openCursor: () => {
        const request = new MockIDBRequest();
        setTimeout(() => {
          request.succeed(null);
        }, 0);
        return request;
      }
    };
  }
}

class MockIDBTransaction {
  constructor(stores) {
    this.stores = stores;
  }

  objectStore(name) {
    return this.stores[name] || new MockIDBObjectStore();
  }
}

class MockIDBDatabase {
  constructor() {
    this.objectStoreNames = { contains: () => false };
    this.stores = {
      sessions: new MockIDBObjectStore()
    };
  }

  createObjectStore(name, options) {
    const store = new MockIDBObjectStore();
    this.stores[name] = store;
    return store;
  }

  transaction(storeNames, mode) {
    return new MockIDBTransaction(this.stores);
  }
}

// Mock IndexedDB globally
global.indexedDB = {
  open: (name, version) => {
    const request = new MockIDBRequest();
    const db = new MockIDBDatabase();
    
    setTimeout(() => {
      if (request.onupgradeneeded) {
        const event = new Event('upgradeneeded');
        Object.defineProperty(event, 'target', { value: { result: db } });
        request.onupgradeneeded(event);
      }
      request.succeed(db);
    }, 0);
    
    return request;
  }
};