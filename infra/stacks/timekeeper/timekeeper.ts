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
