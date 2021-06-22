/**********************************************************************************************************************
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance        *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *       http://aws.amazon.com/asl/                                                                                   *
 *                                                                                                                    *
 *  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 **********************************************************************************************************************/
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
