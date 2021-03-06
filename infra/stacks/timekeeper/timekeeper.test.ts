/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import * as ddb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import { SynthUtils, Capture, arrayWith, stringLike } from '@aws-cdk/assert'
import '@aws-cdk/assert/jest'

import Timekeeper from './index'

// :: ---

let app: cdk.App
let timetable: ddb.Table

// :: ---

beforeEach(() => (app = new cdk.App()))

beforeEach(() => {
  const stack = new cdk.Stack(app, 'test-stack')
  timetable = new ddb.Table(stack, 'test-table', {
    partitionKey: {
      name: 'foo',
      type: ddb.AttributeType.STRING,
    },
  })
})

it('synths without errors', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  SynthUtils.toCloudFormation(stack)
})

it('has one lambda function', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  const lambdas = stack.node.children.filter(
    (child) => child instanceof lambda.Function
  )

  expect(lambdas).toHaveLength(1)
})

it('uses the nodejs v14.x runtime', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  const template = SynthUtils.toCloudFormation(stack)

  expect(template).toHaveResource('AWS::Lambda::Function', {
    Runtime: 'nodejs14.x',
  })
})

it('provides the DynamoDB table name as an env var', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  const template = SynthUtils.toCloudFormation(stack)

  expect(template).toHaveResourceLike('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        TABLE_NAME: {},
      },
    },
  })
})

it('has IAM role for lambda function, with DynamoDB write permissions', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  const template = SynthUtils.toCloudFormation(stack)

  const policyRole = Capture.aString()
  const lambdaRole = Capture.aString()

  expect(template).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: arrayWith('dynamodb:PutItem'),
        },
      ],
    },
    Roles: [
      {
        Ref: policyRole.capture(),
      },
    ],
  })

  expect(template).toHaveResourceLike('AWS::Lambda::Function', {
    Role: {
      'Fn::GetAtt': [lambdaRole.capture(), 'Arn'],
    },
  })

  expect(policyRole.capturedValue).toBe(lambdaRole.capturedValue)

  const role = template.Resources[policyRole.capturedValue]

  expect(role).not.toBeUndefined()
  expect(role.Type).toBe('AWS::IAM::Role')
})

it('has an hourly trigger rule', () => {
  const stack = new Timekeeper(app, 'timekeeper-stack', { timetable })
  const template = SynthUtils.toCloudFormation(stack)

  const targetId = Capture.aString()

  expect(template).toHaveResourceLike('AWS::Events::Rule', {
    ScheduleExpression: stringLike(`cron(0 \* \* \* * \*)`),
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [targetId.capture(), 'Arn'],
        },
      },
    ],
  })

  expect(template.Resources[targetId.capturedValue]).toHaveProperty(
    'Type',
    'AWS::Lambda::Function'
  )
})
