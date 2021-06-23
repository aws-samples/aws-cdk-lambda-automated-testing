/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import 'dotenv/config'
import 'source-map-support/register'

import * as cdk from '@aws-cdk/core'
import Pipeline from '@stacks/pipeline'

// :: ---

export const app = new cdk.App()
new Pipeline(app, 'cicd-pipeline')
