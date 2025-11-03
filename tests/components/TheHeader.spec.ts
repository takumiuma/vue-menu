import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TheHeader from '~/components/TheHeader.vue'

// Routerのモック
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

// Auth0のモック
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn(() =>
    Promise.resolve({
      isAuthenticated: vi.fn(() => Promise.resolve(false)),
      getUser: vi.fn(() => Promise.resolve(null)),
      handleRedirectCallback: vi.fn(() => Promise.resolve()),
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    }),
  ),
}))

describe('TheHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          'v-app-bar': true,
          'v-app-bar-nav-icon': true,
          'v-app-bar-title': true,
          'v-navigation-drawer': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-btn': true,
        },
        mocks: {
          $vuetify: {
            display: {
              mobile: false,
            },
          },
        },
      },
    })

    expect(wrapper.vm).toBeTruthy()
  })

  it('未認証時はホームとメニューリストのみ表示される', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          'v-app-bar': true,
          'v-app-bar-nav-icon': true,
          'v-app-bar-title': true,
          'v-navigation-drawer': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-btn': true,
        },
        mocks: {
          $vuetify: {
            display: {
              mobile: false,
            },
          },
        },
      },
    })

    // isAuthenticatedがfalseの場合のfilteredItemsをチェック
    const vm = wrapper.vm as unknown as { filteredItems: Array<{ title: string }> }
    expect(vm.filteredItems).toHaveLength(2)
    expect(vm.filteredItems[0].title).toBe('ホーム')
    expect(vm.filteredItems[1].title).toBe('メニューリスト')
  })

  it('認証済みの場合はお気に入りも表示される', async () => {
    const mockAuth0Client = {
      isAuthenticated: vi.fn(() => Promise.resolve(true)),
      getUser: vi.fn(() => Promise.resolve({ sub: 'user123' })),
      handleRedirectCallback: vi.fn(() => Promise.resolve()),
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    }

    const { createAuth0Client } = await import('@auth0/auth0-spa-js')
    vi.mocked(createAuth0Client).mockResolvedValue(mockAuth0Client as never)

    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          'v-app-bar': true,
          'v-app-bar-nav-icon': true,
          'v-app-bar-title': true,
          'v-navigation-drawer': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-btn': true,
        },
        mocks: {
          $vuetify: {
            display: {
              mobile: false,
            },
          },
        },
      },
    })

    // onBeforeMountが実行されるまで待つ
    await flushPromises()

    // isAuthenticatedがtrueの場合のfilteredItemsをチェック
    const vm = wrapper.vm as unknown as { filteredItems: Array<{ title: string }> }
    expect(vm.filteredItems).toHaveLength(3)
    expect(vm.filteredItems[0].title).toBe('ホーム')
    expect(vm.filteredItems[1].title).toBe('メニューリスト')
    expect(vm.filteredItems[2].title).toBe('お気に入り')
  })

  it('お気に入りリンクのアイコンがmdi-heartである', async () => {
    const mockAuth0Client = {
      isAuthenticated: vi.fn(() => Promise.resolve(true)),
      getUser: vi.fn(() => Promise.resolve({ sub: 'user123' })),
      handleRedirectCallback: vi.fn(() => Promise.resolve()),
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    }

    const { createAuth0Client } = await import('@auth0/auth0-spa-js')
    vi.mocked(createAuth0Client).mockResolvedValue(mockAuth0Client as never)

    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          'v-app-bar': true,
          'v-app-bar-nav-icon': true,
          'v-app-bar-title': true,
          'v-navigation-drawer': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-btn': true,
        },
        mocks: {
          $vuetify: {
            display: {
              mobile: false,
            },
          },
        },
      },
    })

    // onBeforeMountが実行されるまで待つ
    await flushPromises()

    // 認証済みユーザーのfilteredItemsからお気に入りアイテムをチェック
    const vm = wrapper.vm as unknown as { filteredItems: Array<{ title: string; icon: string; link: string }> }
    const favoriteItem = vm.filteredItems.find((item) => item.title === 'お気に入り')
    expect(favoriteItem).toBeDefined()
    expect(favoriteItem?.icon).toBe('mdi-heart')
    expect(favoriteItem?.link).toBe('/favorites')
  })
})
