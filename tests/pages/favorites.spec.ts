import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import favorites from '~/pages/favorites.vue'

// Mock Auth0
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn().mockResolvedValue({
    isAuthenticated: vi.fn().mockResolvedValue(true),
    getTokenSilently: vi.fn().mockResolvedValue('test-token'),
  }),
}))

// Mock favorite store
vi.mock('~/store/favorite', () => ({
  useFavoriteStore: vi.fn(() => ({
    favorites: [],
    loadFavorites: vi.fn().mockResolvedValue(undefined),
  })),
}))

describe('favorites.vue', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('ページがマウントされる', async () => {
    const wrapper = mount(favorites, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-spacer': { template: '<div></div>' },
          'v-progress-circular': { template: '<div class="loading"></div>' },
          'v-alert': { template: '<div><slot /></div>' },
          'FavoriteButton': { template: '<button class="favorite-btn"></button>' },
        },
      },
    })

    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('お気に入りメニューというタイトルが表示される', async () => {
    const wrapper = mount(favorites, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-spacer': { template: '<div></div>' },
          'v-progress-circular': { template: '<div class="loading"></div>' },
          'v-alert': { template: '<div><slot /></div>' },
          'FavoriteButton': { template: '<button class="favorite-btn"></button>' },
        },
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('お気に入りメニュー')
  })

  it('お気に入りが空の場合、メッセージが表示される', async () => {
    const wrapper = mount(favorites, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-spacer': { template: '<div></div>' },
          'v-progress-circular': { template: '<div class="loading"></div>' },
          'v-alert': { template: '<div class="empty-message"><slot /></div>' },
          'FavoriteButton': { template: '<button class="favorite-btn"></button>' },
        },
      },
    })

    await flushPromises()
    
    // loading が false になるのを待つ
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('お気に入りがありません')
  })
})
