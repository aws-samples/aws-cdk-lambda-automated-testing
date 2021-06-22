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

import path from 'path'
import * as esbuild from 'esbuild'

import { handler } from './index'

// :: ---

it('bundles without errors', async () => {
  const codepath = path.join(__dirname, 'ping.ts')

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

it('responds with "pong"', async () => {
  const task = handler()
  expect(task).resolves.toHaveProperty('body', 'pong')
})

it('returns a successful status code', async () => {
  const response = await handler()

  expect(response).toHaveProperty('statusCode')
  expect(response.statusCode).toBeGreaterThanOrEqual(200)
  expect(response.statusCode).toBeLessThan(300)
})
