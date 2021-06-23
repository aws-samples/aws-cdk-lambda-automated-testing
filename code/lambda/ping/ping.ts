/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
export const handler: LambdaAsyncFunctionHandler<ApiResponse> = async () => {
  return {
    statusCode: 200,
    body: 'pong',
  }
}
