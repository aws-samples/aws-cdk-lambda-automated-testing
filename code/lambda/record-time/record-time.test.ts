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

/* eslint-disable unicorn/prefer-module */

// :: this has to be above the imports, because this needs to be available
//    when the modules are imported (and consequently mocked).
const MOCK_PUT = jest.fn()

import path from 'path'
import * as esbuild from 'esbuild'
import * as uuid from 'uuid'

import { handler } from './index'

jest.mock('aws-sdk', () => {
  // :: we just want to mock out the DynamoDB component for these tests.
  return {
    ...jest.requireActual('aws-sdk'),
    // :: ---
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        put: MOCK_PUT,
      })),
    },
  }
})

// :: ---

const MOCK_SCHEDULED_EVENT = {
  source: 'aws.events',
  'detail-type': 'Scheduled Event',
}

// :: ---

beforeEach(() => (process.env['TABLE_NAME'] = 'sample-table-name'))
beforeEach(() => {
  MOCK_PUT.mockReturnValue({ promise: () => Promise.resolve() })
})

afterEach(() => jest.useRealTimers())
afterEach(() => jest.resetAllMocks())
afterEach(() => delete process.env['TABLE_NAME'])

it('bundles without errors', async () => {
  const codepath = path.join(__dirname, 'record-time.ts')

  await esbuild.build({
    entryPoints: [codepath],
    external: ['aws-sdk'],
    platform: 'node',
    bundle: true,
    write: false,
  })
})

it('is async', async () => {
  const task = handler()
  expect(task).toBeInstanceOf(Promise)
})

it('fails fast when not triggered by an EventBridge scheduled event', async () => {
  const dateSpy = jest.spyOn(global, 'Date')

  const response = await handler()
  expect(response).toBeUndefined()
  expect(dateSpy).not.toHaveBeenCalled()

  dateSpy.mockRestore()
})

it('returns an ISO8601-formatted string of the current date/time', async () => {
  const __timestamp = '2020-01-20T12:30:00.000Z'
  const now = Date.parse(__timestamp)
  jest.useFakeTimers()
  jest.setSystemTime(now)

  const response = await handler(MOCK_SCHEDULED_EVENT)
  expect(response).toBe(__timestamp)
})

it('uses the DocumentClient', async () => {
  await handler(MOCK_SCHEDULED_EVENT)
  expect(MOCK_PUT).toHaveBeenCalledTimes(1)
})

it('uses the provided DynamoDB table name', async () => {
  const MOCK_TABLE_NAME = uuid.v4()
  process.env.TABLE_NAME = MOCK_TABLE_NAME

  await handler(MOCK_SCHEDULED_EVENT)

  const [{ TableName }] = MOCK_PUT.mock.calls[0]
  expect(TableName).toBe(MOCK_TABLE_NAME)
})

it('correctly sets payload parameters for DynamoDB record', async () => {
  const __timestamp = '2020-01-20T12:30:00.000Z'
  const now = Date.parse(__timestamp)
  jest.useFakeTimers()
  jest.setSystemTime(now)

  await handler(MOCK_SCHEDULED_EVENT)

  const [{ Item }] = MOCK_PUT.mock.calls[0]

  // :: `.id` needs to be a UUID
  expect(uuid.validate(Item.id)).toBe(true)

  // :: `.timestamp` needs to be an ISO 8601 representation of the current date/time
  expect(Item.timestamp).toBe(__timestamp)
})
