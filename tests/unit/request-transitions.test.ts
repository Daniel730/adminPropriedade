import { describe, it, expect } from 'vitest'
import { validateTransition } from '@/lib/request-transitions'

describe('validateTransition', () => {
  it('allows OPEN -> IN_PROGRESS', () => {
    expect(validateTransition('OPEN', 'IN_PROGRESS')).toBe(true)
  })

  it('allows IN_PROGRESS -> RESOLVED', () => {
    expect(validateTransition('IN_PROGRESS', 'RESOLVED')).toBe(true)
  })

  it('allows RESOLVED -> OPEN', () => {
    expect(validateTransition('RESOLVED', 'OPEN')).toBe(true)
  })

  it('rejects IN_PROGRESS -> OPEN', () => {
    expect(validateTransition('IN_PROGRESS', 'OPEN')).toBe(false)
  })

  it('rejects RESOLVED -> IN_PROGRESS', () => {
    expect(validateTransition('RESOLVED', 'IN_PROGRESS')).toBe(false)
  })

  it('rejects same status transitions', () => {
    expect(validateTransition('OPEN', 'OPEN')).toBe(false)
  })
})
