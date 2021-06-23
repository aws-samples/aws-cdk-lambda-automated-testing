/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'

// :: ---

it('synths without errors', async () => {
  const { app } = await import('./app-standalone')
  const stacks = app.node.children.filter((child) => child instanceof cdk.Stack)

  expect(stacks.length).toBeGreaterThan(0)

  for (const stack of stacks) {
    SynthUtils.toCloudFormation(stack as cdk.Stack)
  }
})
