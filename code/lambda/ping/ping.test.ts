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
