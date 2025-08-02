import { vi } from 'vitest'

// Mock Nuxt composables and runtime
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.definePageMeta = vi.fn()
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.defineNuxtPlugin = vi.fn()
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.defineNuxtRouteMiddleware = vi.fn()
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.navigateTo = vi.fn()
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.abortNavigation = vi.fn()
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.setPageLayout = vi.fn()

// Mock console to reduce noise in tests
global.console = {
  ...console,
  // Keep errors and warns visible
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}
