/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import 'dotenv/config'
import 'source-map-support/register'

import * as cdk from '@aws-cdk/core'
import AppStackset from '@constructs/app-stackset'

// :: ---

export const app = new cdk.App()
new AppStackset(app, 'app-stackset')
