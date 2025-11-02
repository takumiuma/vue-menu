import { vi } from 'vitest'
import { defineStore } from 'pinia'
import { ref, computed, readonly, onMounted } from 'vue'

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
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.defineStore = defineStore
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.ref = ref
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.computed = computed
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.readonly = readonly
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.onMounted = onMounted
// @ts-expect-error Overriding Nuxt auto-imports for testing
globalThis.useRuntimeConfig = vi.fn(() => ({
  public: {
    AUTH0_DOMAIN: 'test-domain',
    AUTH0_CLIENT_ID: 'test-client-id',
  },
}))

// Mock console to reduce noise in tests
global.console = {
  ...console,
  // Keep errors and warns visible
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}
