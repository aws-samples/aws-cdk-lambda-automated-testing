/**********************************************************************************************************************
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance        *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *       http://aws.amazon.com/asl/                                                                                   *
 *                                                                                                                    *
 *  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 **********************************************************************************************************************/
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
