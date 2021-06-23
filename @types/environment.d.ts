/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      // :: We define the possible values for env variables here.
      NODE_ENV?: 'production' | 'development' | 'test'
      AWS_REGION?: string

      // :: These are used by the CDK Pipelines process.
      PIPELINES_OAUTH_TOKEN_NAME?: string
      PIPELINES_SOURCE_OWNER?: string
      PIPELINES_SOURCE_REPOSITORY?: string
      PIPELINES_SOURCE_BRANCH?: string
    }
  }
}

export {}
