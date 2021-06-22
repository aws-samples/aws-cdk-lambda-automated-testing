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

  // :: assert that a DynamoDB table name was provided
  if (!process.env.TABLE_NAME) {
    throw new Error('DynamoDB table name is not set.')
  }

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
