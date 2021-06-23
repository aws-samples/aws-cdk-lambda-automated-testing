/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'
import '@aws-cdk/assert/jest'

import AppStackset from './index'

// :: ---

let app: cdk.App

// :: ---

beforeEach(() => (app = new cdk.App()))

it('synths without errors', () => {
  new AppStackset(app)
  const stacks = app.node.children.filter((child) => child instanceof cdk.Stack)

  for (const stack of stacks) {
    SynthUtils.toCloudFormation(stack as cdk.Stack)
  }
})
