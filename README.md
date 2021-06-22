# lambda-cdk-tests

This repository illustrates how to set up unit testing against code that is meant to
be deployed as [AWS Lambda][^1] functions. Since the code is deployed using the
[AWS CDK][^2], we're illustrating how to test that as well.

The AWS CDK allows us to describe our infrastructure in the same coding language as
the raw codefiles we're using as the content of our Lambda functions — this allows us
to test both the logic and the infrastructure that runs that logic in one go.

## Sample Application System

![Architecture](assets/archi.jpg)

This codebase deploys a simple system: an [AWS Lambda][^5] function is saves the current date and
time to an [Amazon DynamoDB][^6] table whenever it's triggered. This function is invoked every hour
using an [Amazon EventBridge][^7] schedule.

## Structure

Primary code is organized accordingly:

- `code/` — loose codefiles (e.g. code files for Lambda functions, Jupyter notebooks, etc.)
- `infra/` — AWS CDK constructs (e.g. this is your [IaC][^3] component, and what deploys your resources into AWS.)

## Running Tests

This codebase is configured to treat any file `*.test.ts` or `*.spec.ts` as a test file,
processed by [Jest][^4]. The test files are placed alongside the code files they're
meant to test.

> So `foo.test.ts` will be testing `foo.ts` (generally mocking everything else),
> and will be placed in the same directory.

To change this behavior (and any other piece of configuration),
see `jest.config.js`.

You can run tests by:

```bash
yarn test
# :: or
npm test
```

Jest allows you to automatically run tests related to changed files as you're modifying
codefiles too:

```bash
yarn test --watch
# :: or
npm test -- --watch
```

---

[Twitter][twitter] &middot; [Homepage][homepage]

[^1]: https://aws.amazon.com/lambda
[^2]: https://aws.amazon.com/cdk
[^3]: https://docs.aws.amazon.com/whitepapers/latest/modern-application-development-on-aws/managing-infrastructure-as-code.html
[^4]: https://jestjs.io
[^5]: https://aws.amazon.com/lambda
[^6]: https://aws.amazon.com/dynamodb
[^7]: https://aws.amazon.com/eventbridge

[twitter]: https://twitter.com/techlifemusic
[homepage]: https://richardneililagan.com
