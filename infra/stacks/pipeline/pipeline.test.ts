/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'
import '@aws-cdk/assert/jest'

import Pipeline from './index'

// :: ---

let app: cdk.App

// :: ---

beforeEach(() => (app = new cdk.App()))

beforeEach(() => {
  process.env.PIPELINES_OAUTH_TOKEN_NAME = 'test-oauth-token-name'
  process.env.PIPELINES_SOURCE_OWNER = 'test-source-owner'
  process.env.PIPELINES_SOURCE_REPOSITORY = 'test-source-repository'
  process.env.PIPELINES_SOURCE_BRANCH = 'test-source-branch'
})

it('synths without errors', () => {
  const stack = new Pipeline(app, 'cicd-pipeline')
  SynthUtils.toCloudFormation(stack)
})
