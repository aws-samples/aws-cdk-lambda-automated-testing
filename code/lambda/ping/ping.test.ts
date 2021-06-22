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
