/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import * as ddb from '@aws-cdk/aws-dynamodb'
import { SynthUtils } from '@aws-cdk/assert'
import '@aws-cdk/assert/jest'

import DataStore from './index'

// :: ---

let app: cdk.App

// :: ---

beforeEach(() => (app = new cdk.App()))

it('synths without errors', () => {
  const stack = new DataStore(app, 'data-store-stack')
  SynthUtils.toCloudFormation(stack)
})

it('creates a DynamoDB table with the proper keys', () => {
  const stack = new DataStore(app, 'data-store-stack')
  const template = SynthUtils.toCloudFormation(stack)

  expect(template).toHaveResource('AWS::DynamoDB::Table', {
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'timestamp',
        KeyType: 'RANGE',
      },
    ],
  })
})

it('creates a DynamoDB table with on-demand billing', () => {
  const stack = new DataStore(app, 'data-store-stack')
  const template = SynthUtils.toCloudFormation(stack)

  expect(template).toHaveResource('AWS::DynamoDB::Table', {
    BillingMode: 'PAY_PER_REQUEST',
  })
})

it('only creates one DynamoDB table', () => {
  const stack = new DataStore(app, 'data-store-stack')
  const tables = stack.node.children.filter(
    (child) => child instanceof ddb.Table
  )

  expect(tables).toHaveLength(1)
})
