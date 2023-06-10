import { describe, expect, test } from '@jest/globals'
import lowerCaseText from './string'

describe('lowerCaseText util', () => {
  test('Returns w when sent W', () => {
    expect(lowerCaseText('W')).toBe('w')
  })
})
