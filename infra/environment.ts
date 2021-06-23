/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

const Environment = {
  get IS_PRODUCTION(): boolean {
    return process.env.NODE_ENV === 'production'
  },

  get REGION(): string {
    return process.env.AWS_REGION ?? 'ap-southeast-1'
  },
}

export default Environment
