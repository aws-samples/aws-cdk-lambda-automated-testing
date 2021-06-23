/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'

// :: ---

beforeEach(() => {
  process.env.PIPELINES_OAUTH_TOKEN_NAME = 'test-oauth-token-name'
  process.env.PIPELINES_SOURCE_OWNER = 'test-source-owner'
  process.env.PIPELINES_SOURCE_REPOSITORY = 'test-source-repository'
  process.env.PIPELINES_SOURCE_BRANCH = 'test-source-branch'
})

it('synths without errors', async () => {
  const { app } = await import('./app-pipeline')
  const stacks = app.node.children.filter((child) => child instanceof cdk.Stack)

  expect(stacks.length).toBeGreaterThan(0)

  for (const stack of stacks) {
    SynthUtils.toCloudFormation(stack as cdk.Stack)
  }
})
