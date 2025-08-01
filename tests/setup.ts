import { vi } from 'vitest'

// Mock Nuxt composables and runtime
;(global as any).definePageMeta = vi.fn()
;(global as any).defineNuxtPlugin = vi.fn()
;(global as any).defineNuxtRouteMiddleware = vi.fn()
;(global as any).navigateTo = vi.fn()
;(global as any).abortNavigation = vi.fn()
;(global as any).setPageLayout = vi.fn()

// Mock console to reduce noise in tests
global.console = {
  ...console,
  // Keep errors and warns visible
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}
