/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import { SynthUtils } from '@aws-cdk/assert'
import '@aws-cdk/assert/jest'

import SourceAction from './source-action'

// :: ---

let stack: cdk.Stack
let outputArtifact: codepipeline.Artifact

// :: ---

beforeEach(() => {
  stack = new cdk.Stack()
  outputArtifact = new codepipeline.Artifact('test-artifact')
})

beforeEach(() => {
  process.env.PIPELINES_OAUTH_TOKEN_NAME = 'test-oauth-token-name'
  process.env.PIPELINES_SOURCE_OWNER = 'test-source-owner'
  process.env.PIPELINES_SOURCE_REPOSITORY = 'test-source-repository'
  process.env.PIPELINES_SOURCE_BRANCH = 'test-source-branch'
})

it('synths without errors', () => {
  new SourceAction(stack, 'source-action', { outputArtifact })
  SynthUtils.toCloudFormation(stack)
})

it('fails synth when an oauth token is not provided via SecretsManager', () => {
  delete process.env['PIPELINES_OAUTH_TOKEN_NAME']

  expect(() => {
    new SourceAction(stack, 'source-action', { outputArtifact })
    SynthUtils.toCloudFormation(stack)
  }).toThrow()
})

it('fails synth when owner, repo, and/or branch values are not set in environment, or are empty', () => {
  const targetkeys = [
    'PIPELINES_SOURCE_OWNER',
    'PIPELINES_SOURCE_REPOSITORY',
    'PIPELINES_SOURCE_BRANCH',
  ]

  for (const targetkey of targetkeys) {
    process.env[targetkey] = ''

    const teststack = new cdk.Stack()
    new SourceAction(teststack, 'source-action', { outputArtifact })
    expect(() => SynthUtils.toCloudFormation(teststack)).toThrow(
      /^Validation failed/
    )
  }

  for (const targetkey of targetkeys) {
    delete process.env[targetkey]

    const teststack = new cdk.Stack()
    new SourceAction(teststack, 'source-action', { outputArtifact })
    expect(() => SynthUtils.toCloudFormation(teststack)).toThrow(
      /^Validation failed/
    )
  }
})
