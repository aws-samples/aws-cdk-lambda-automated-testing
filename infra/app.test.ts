import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'

import { app } from './app'

// :: ---

it('synths without errors', () => {
  const stacks = app.node.children.filter((child) => child instanceof cdk.Stack)

  for (const stack of stacks) {
    SynthUtils.toCloudFormation(stack as cdk.Stack)
  }
})
