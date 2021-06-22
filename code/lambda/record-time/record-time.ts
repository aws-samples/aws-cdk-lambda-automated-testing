import { DynamoDB } from 'aws-sdk'
import { v4 as uuid } from 'uuid'

// :: ---

const client = new DynamoDB.DocumentClient()

export const handler: LambdaAsyncFunctionHandler<string | void> = async (
  event
) => {
  // :: if this Lambda function was triggered by anything other than an
  //    Amazon EventBridge scheduled event, then fail fast.
  if (!event) return
  if (event?.source !== 'aws.events') return
  if (event['detail-type'] !== 'Scheduled Event') return

  // :: ---

  const timestamp = new Date().toISOString()

  const payload = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      id: uuid(),
      timestamp,
    },
  }

  await client.put(payload).promise()

  return timestamp
}
