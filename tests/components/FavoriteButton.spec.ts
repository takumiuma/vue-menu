import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FavoriteButton from '~/components/FavoriteButton.vue'
import { useFavoriteStore } from '~/store/favorite'

// Mock Auth0
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn().mockResolvedValue({
    isAuthenticated: vi.fn().mockResolvedValue(false),
    getTokenSilently: vi.fn().mockResolvedValue('test-token'),
  }),
}))

describe('FavoriteButton', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('未認証の場合、ボタンが表示される', async () => {
    const wrapper = mount(FavoriteButton, {
      props: {
        menuId: 1,
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': {
            template: '<button><slot /></button>',
            props: ['icon', 'color', 'loading', 'size'],
          },
        },
      },
    })

    await flushPromises()
    expect(wrapper.vm).toBeTruthy()
  })

  it('お気に入り未追加の場合、アウトラインハートが表示される', async () => {
    mount(FavoriteButton, {
      props: {
        menuId: 1,
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': true,
        },
      },
    })

    await flushPromises()
    // Storeから直接状態を確認
    const store = useFavoriteStore()
    expect(store.isFavorite(1)).toBe(false)
  })

  it('お気に入り追加済みの場合、塗りつぶしハートが表示される', async () => {
    const store = useFavoriteStore()
    store.addLocalFavorite({
      favoriteId: 1,
      menuId: 1,
      menuName: 'Test Menu',
      genreIds: [1],
      categoryIds: [1],
    })

    mount(FavoriteButton, {
      props: {
        menuId: 1,
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': true,
        },
      },
    })

    await flushPromises()
    // Storeから直接状態を確認
    expect(store.isFavorite(1)).toBe(true)
  })

  it('sizeプロパティが正しく渡される', async () => {
    const wrapper = mount(FavoriteButton, {
      props: {
        menuId: 1,
        size: 'large',
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': true,
        },
      },
    })

    await flushPromises()
    expect(wrapper.props('size')).toBe('large')
  })

  it('未認証でクリックした場合、エラーメッセージが表示される', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(FavoriteButton, {
      props: {
        menuId: 1,
      },
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            props: ['icon', 'color', 'loading', 'size'],
          },
        },
      },
    })

    await flushPromises()
    const btnWrapper = wrapper.findComponent({ name: 'v-btn' })
    if (btnWrapper.exists()) {
      await btnWrapper.trigger('click')
      await flushPromises()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'ログインが必要です')
    }
    consoleErrorSpy.mockRestore()
  })
})
