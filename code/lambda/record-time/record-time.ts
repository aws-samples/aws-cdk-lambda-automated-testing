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
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuid(),
      timestamp,
    },
  }

  await client.put(payload).promise()

  return timestamp
}
