declare global {
  type LambdaEvent = {
    [key: string]: unknown
  }
  type LambdaFunctionHandler<T> = (event?: LambdaEvent, content?: unknown) => T
  type LambdaAsyncFunctionHandler<T> = LambdaFunctionHandler<Promise<T>>

  type ApiResponse = {
    statusCode: number
    body: string
    headers?: {
      [key: string]: string
    }
  }
}

export {}
