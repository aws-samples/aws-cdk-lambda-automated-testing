/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'

import AppStackset from '@constructs/app-stackset/app-stackset'
import Environment from '@infra/environment'

// :: ---

class AppStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      env: {
        region: Environment.REGION,
      },
    })

    // :: This is required to be set in the context (either here, or through the
    //    project `cdk.json` context file) if we want to use CDK Pipelines.
    this.node.setContext('@aws-cdk/core:newStyleStackSynthesis', true)

    new AppStackset(this)
  }
}

export default AppStage
