export const handler: LambdaAsyncFunctionHandler<ApiResponse> = async () => {
  return {
    statusCode: 200,
    body: 'pong',
  }
}
