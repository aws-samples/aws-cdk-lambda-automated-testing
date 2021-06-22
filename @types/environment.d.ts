declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // :: We define the possible values for env variables here.
      NODE_ENV?: 'production' | 'development' | 'test'
      AWS_REGION?: string
    }
  }
}

export {}
