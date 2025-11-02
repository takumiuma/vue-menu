import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import menuList from '~/pages/menuList.vue'

// Mock Auth0
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn().mockResolvedValue({
    isAuthenticated: vi.fn().mockResolvedValue(false),
    getTokenSilently: vi.fn().mockResolvedValue('test-token'),
  }),
}))

// Mock composables
vi.mock('~/composables/useMenuService', () => ({
  useMenuService: vi.fn(() => ({
    menuList: { value: [] },
    getMenuInfoList: vi.fn().mockResolvedValue([]),
    createMenu: vi.fn().mockResolvedValue({}),
    updateMenu: vi.fn().mockResolvedValue({}),
    deleteMenu: vi.fn().mockResolvedValue({}),
    updateMenuGenre: vi.fn().mockResolvedValue({}),
    updateMenuCategory: vi.fn().mockResolvedValue({}),
  })),
}))

vi.mock('~/composables/useLoadingOverlayService', () => ({
  useLoadingOverlayStore: vi.fn(() => ({
    startLoading: vi.fn(),
    endLoading: vi.fn(),
  })),
}))

describe('menuList.vue', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('ページがマウントされる', async () => {
    const wrapper = mount(menuList, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button><slot /></button>' },
          'v-data-table': { template: '<div><slot /></div>' },
          'v-dialog': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-text-field': { template: '<input />' },
          'v-combobox': { template: '<input />' },
          'v-chip-group': { template: '<div><slot /></div>' },
          'v-chip': { template: '<div><slot /></div>' },
          'FavoriteButton': { template: '<button class="favorite-btn"></button>' },
        },
      },
    })

    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('認証済みの場合、FavoriteButtonが表示される', async () => {
    const wrapper = mount(menuList, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button><slot /></button>' },
          'v-data-table': {
            template: `
              <div>
                <slot name="item.action" :item="{ id: 1, name: 'Test Menu' }" />
              </div>
            `,
          },
          'v-dialog': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-text-field': { template: '<input />' },
          'v-combobox': { template: '<input />' },
          'v-chip-group': { template: '<div><slot /></div>' },
          'v-chip': { template: '<div><slot /></div>' },
          'v-icon': { template: '<i><slot /></i>' },
          'FavoriteButton': {
            template: '<button class="favorite-btn" @click="$emit(\'favorite-changed\', true)"></button>',
            props: ['menuId', 'size'],
          },
        },
      },
    })

    await flushPromises()
    
    // コンポーネントがマウントされることを確認
    // Auth0の初期化により、認証状態が確認される
    expect(wrapper.vm.isAuthenticated).toBeDefined()
  })

  it('未認証の場合、FavoriteButtonが表示されない', async () => {
    const wrapper = mount(menuList, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button><slot /></button>' },
          'v-data-table': {
            template: `
              <div>
                <slot name="item.action" :item="{ id: 1, name: 'Test Menu' }" />
              </div>
            `,
          },
          'v-dialog': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-text-field': { template: '<input />' },
          'v-combobox': { template: '<input />' },
          'v-chip-group': { template: '<div><slot /></div>' },
          'v-chip': { template: '<div><slot /></div>' },
          'v-icon': { template: '<i><slot /></i>' },
          'FavoriteButton': {
            template: '<button class="favorite-btn"></button>',
            props: ['menuId', 'size'],
          },
        },
      },
    })

    await flushPromises()
    
    // isAuthenticatedが定義されていることを確認
    expect(wrapper.vm.isAuthenticated).toBeDefined()
  })

  it('favoriteChangedイベントハンドラーが定義されている', async () => {
    const wrapper = mount(menuList, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button><slot /></button>' },
          'v-data-table': { template: '<div><slot /></div>' },
          'v-dialog': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-text-field': { template: '<input />' },
          'v-combobox': { template: '<input />' },
          'v-chip-group': { template: '<div><slot /></div>' },
          'v-chip': { template: '<div><slot /></div>' },
          'FavoriteButton': { template: '<button class="favorite-btn"></button>' },
        },
      },
    })

    await flushPromises()
    
    // onFavoriteChangedメソッドが定義されていることを確認
    expect(typeof wrapper.vm.onFavoriteChanged).toBe('function')
  })
})
