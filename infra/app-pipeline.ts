/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import 'dotenv/config'
import 'source-map-support/register'

import * as cdk from '@aws-cdk/core'
import Pipeline from '@stacks/pipeline'
import Environment from '@infra/environment'

// :: ---

export const app = new cdk.App()

new Pipeline(app, 'cicd-pipeline', {
  env: {
    region: Environment.REGION,
  },
})
