// Global test setup: polyfill IndexedDB with in-memory implementation
// Must be imported before any Dexie usage
import 'fake-indexeddb/auto'
import '@testing-library/jest-dom'
