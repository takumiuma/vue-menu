import { vi } from 'vitest'

// Mock Nuxt composables and runtime
global.definePageMeta = vi.fn()
global.defineNuxtPlugin = vi.fn()
global.defineNuxtRouteMiddleware = vi.fn()
global.navigateTo = vi.fn()
global.abortNavigation = vi.fn()
global.setPageLayout = vi.fn()

// Mock console to reduce noise in tests
global.console = {
  ...console,
  // Keep errors and warns visible
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}