import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheFooter from '~/components/TheFooter.vue'

describe('TheFooter', () => {
  it('renders without errors', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: {
          'v-footer': true
        }
      }
    })
    
    expect(wrapper.vm).toBeTruthy()
  })
})