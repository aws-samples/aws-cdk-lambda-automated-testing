/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
