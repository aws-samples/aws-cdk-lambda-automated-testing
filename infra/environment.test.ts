import { randomBytes } from 'crypto'
import Environment from './environment'

// :: ---

beforeEach(() => {
  // :: clear all preset values on our env
  delete process.env['NODE_ENV']
  delete process.env['AWS_REGION']
})

describe('IS_PRODUCTION', () => {
  it('defaults to non-production', () => {
    expect(process.env.NODE_ENV).not.toBe('production')
    expect(Environment.IS_PRODUCTION).toBe(false)
  })

  it('parses NODE_ENV correctly', () => {
    process.env.NODE_ENV = 'production'
    expect(Environment.IS_PRODUCTION).toBe(true)

    process.env.NODE_ENV = 'development'
    expect(Environment.IS_PRODUCTION).toBe(false)

    process.env.NODE_ENV = 'test'
    expect(Environment.IS_PRODUCTION).toBe(false)
  })
})

describe('REGION', () => {
  it('defaults to ap-southeast-1', () => {
    expect(process.env.AWS_REGION).toBeUndefined()
    expect(Environment.REGION).toBe('ap-southeast-1')
  })

  it('reads AWS_REGION correctly', () => {
    const regionValue = randomBytes(20).toString('hex')
    process.env.AWS_REGION = regionValue

    expect(Environment.REGION).toBe(regionValue)
  })
})
