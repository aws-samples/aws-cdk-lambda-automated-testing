/* eslint-disable unicorn/no-static-only-class */

class Environment {
  static get IS_PRODUCTION(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  static get REGION(): string {
    return process.env.AWS_REGION ?? 'ap-southeast-1'
  }
}

export default Environment
