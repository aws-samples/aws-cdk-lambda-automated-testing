/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as cdk from '@aws-cdk/core'
import * as ddb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda-nodejs'
import * as events from '@aws-cdk/aws-events'
import * as targets from '@aws-cdk/aws-events-targets'

// :: ---

export interface TimekeeperProps extends cdk.StackProps {
  timetable: ddb.Table
}

class Timekeeper extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TimekeeperProps) {
    super(scope, id, props)

    const timekeeperFunction = new lambda.NodejsFunction(
      this,
      'timekeeper-function',
      {
        entry: 'code/lambda/record-time/index.ts',
        handler: 'handler',
        environment: {
          TABLE_NAME: props.timetable.tableName,
        },
      }
    )

    props.timetable.grantReadWriteData(timekeeperFunction)

    new events.Rule(this, 'hourly-trigger', {
      schedule: events.Schedule.expression('0 * * * ? *'),
      targets: [new targets.LambdaFunction(timekeeperFunction)],
    })
  }
}

export default Timekeeper
