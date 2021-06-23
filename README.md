# Automated, shared testing pipeline for AWS Lambda codefiles and AWS CDK constructs

This repository illustrates how to set up a shared testing process for both
[AWS Lambda][lambda] functions, as well as the [AWS CDK][cdk] constructs that describe how
these are deployed onto the AWS Cloud.

The same structure can be adapted for most anything that requires having to deploy
loose codefiles onto AWS resources (e.g. Lambda functions, Jupyter notebooks, etc.)

Testing in this codebase is done using [Jest][jest], which is the test runner installed
when you use the [AWS CDK CLI][aws-cdk] tool to [bootstrap a new project][cdk-init].
This choice is mostly a matter of preference — you should be able to use your own
choice of testing frameworks if you want to.

Finally, this codebase allows you to deploy the sample application as either a
[standalone deployment](#standalone-deployment), or as an [automatic deployment](#cdk-pipelines-deployment)
using a continuous delivery pipeline powered by [CDK Pipelines][cdk-pipelines]
and [AWS CodePipeline][aws-codepipeline].

### Why?

The AWS CDK allows us to describe our infrastructure in the same coding language as
the raw codefiles we're using as the content of our Lambda functions — this allows us
to test both the logic and the infrastructure that runs that logic in one go.

It is important that we are able to verify as much of the logic and behavior of
systems as possible before we deploy them. This allows us to catch potential defects
much faster than if we were performing all testing on the target platform itself,
after it has been deployed.

A healthy development pipeline will generally consist of testing both on and off-platforms.

---

### Contents

- [Sample Application System](#sample-application-system)
  - [Deployment options](#deployment-options)
- [Usage](#usage)
  - [Project structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Running tests](#running-tests)
- [Deploying into an AWS account](#deploying-into-an-aws-account)
  - [Bootstrapping the AWS account](#bootstrapping-the-aws-account)
  - [Standalone deployment](#standalone-deployment)
  - [CDK Pipelines deployment](#cdk-pipelines-deployment)
- [Security](#security)
- [License](#license)

---

## Sample Application System

![Architecture](assets/archi.jpg)

This codebase is meant to deploy a simple system: an [AWS Lambda][lambda] function saves the current date and
time to an [Amazon DynamoDB][dynamodb] table whenever it's triggered. This Lambda function
is invoked every hour using an [Amazon EventBridge][eventbridge] schedule using a
CRON expression.

### Deployment options

> **Important:** You _don't_ need to actually deploy this into your AWS account,
> but you _can_ if you want to. All the tests illustrated here are built so that they
> should be executable from your local environment. See [Running Tests](#running-tests) below.

Since this is a fully-working CDK project, you can deploy this to your AWS account
if you want to. This project is set up to be deployable in two ways:

#### Standalone deployment

This allows you to deploy the project into your AWS account, and that's pretty much it. This workflow
mimics the process of having to _manually_ deploy your applications from a controlled,
secured environment.

Deploying in this way lets you try things out quickly, but is not a particularly
recommended strategy for important systems. Use this if you want to get a feel for
deploying things.

#### CDK Pipelines deployment

This deploys a fully-functioning automatic CI/CD pipeline on your account.
The codebase is configured to track a Github repository, and automatically deploy changes
that are pushed / merged into a specified branch.

This flow illustrates automatic builds, testing, and deployments following changes
made by an engineering team.

Note that this codebase is configured to run tests as part of the pipeline —
**deployment will fail** if any of the tests provided fail for any reason.

## Usage

### Project Structure

Primary code is organized accordingly:

- `code/` — loose codefiles (e.g. files for Lambda functions, Jupyter notebooks, etc.)
- `infra/` — AWS CDK constructs (e.g. this is your [IaC][iac] component, and is what deploys your resources into AWS.)

If you want to follow the code along, the entrypoints are in `infra/app-standalone.ts`
and `infra/app-pipeline.ts` for the standalong and pipelines deployments respectively.

### Prerequisites

You will need to have **Node.js** installed on your environment to use this codebase.
This uses `node v14.x` — review your installed version with `node --version`.

All of this codebase's dependencies are listed in `package.json`.
Run the following command from your project root to install dependencies:

```bash
yarn

# :: or
npm install
```

### Running Tests

This codebase is configured to treat any file `*.test.ts` or `*.spec.ts` as a test file,
processed by [Jest][jest]. The test files are placed alongside the code files they're
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

## Deploying into an AWS account

> **Important:** You don't need to deploy this project to try out testing.
> See [Running Tests](#running-tests) above.

### Bootstrapping the AWS account

Before deploying any CDK project into an AWS account, the AWS account itself must be
[bootstrapped][cdk-bootstrapping]. This is generally only done once in the lifetime
of the AWS account — once it's been bootstrapped, any number of CDK projects can be
deployed into it.

If you haven't bootstrapped your AWS account for CDK use before, run the following
from your project root:

> **Note:** We're using the modern style of CDK bootstrapping here, which is expected
> to become the default way to bootstrap eventually.

```bash
# :: on macOS / Linux
export CDK_NEW_BOOTSTRAP=1
yarn cdk bootstrap
```

```powershell
# :: on Windows
set CDK_NEW_BOOTSTRAP=1
yarn cdk bootstrap
```

### Standalone deployment

To deploy a standalone deployment (i.e. no automatic CI/CD pipelines, deployments and updates
will always be triggered manually):

```bash
yarn cdk:standalone deploy --all
```

If you make changes to the infrastructure and want to update the deployment, you can
just run the command above again.

To cleanup and remove the deployment, just run:

```bash
yarn cdk:standalone destroy --all
```

### CDK Pipelines deployment

To deploy an automated CI/CD process using [CDK Pipelines][cdk-pipelines], you'll need
to setup a bit more configuration. This will create a continuous delivery pipeline
on your AWS account that tracks a Github repository, and updates the application
system automatically whenever a change is committed.

These steps assume that you've push a copy / fork of this repository in your own
Github account.

#### — Github access token —

To allow the CDK deployment to set up the correct listening mechanism on your Github
repository, we'll need to provide an access token with the appropriate permissions
to the CDK pipeline.

Follow the steps on [creating a personal access token][github-pat] to create an access token,
making sure that it has permissions for the `repo` and `admin:repo_hook` scopes.
Take note of the token.

#### — Store the access token as a secret —

We'll need to give the access token to the CDK somehow, but it is **very insecure**
to store it in plaintext inside your codebase, or in environment variables. To allow
us to read sensitive values into our application, the CDK allows reading a secret value
from [AWS Secrets Manager][aws-secretsmanager].

1. Log into your AWS Management Console, then navigate to your [AWS Secrets Manager console][aws-sm-console].
2. Click on the `Store a new secret` button.
3. On step 1:
   1. Set **secret type** to `Other type of secrets`,
   2. Select `Plaintext` in the bottom section,
   3. Clear the textbox, and put in your Github access token,
   4. Click `Next`.
4. Specify a **secret name** (and description, if you wish).
   Note the secret name for later. Click `Next`.
5. For our purposes, we don't want to perform automatic rotation. Click `Next`.
6. Once you've reviewed the values you've provided, click `Store` at the bottom of the page.

#### — Environment variables —

This codebase is configured to track four environment variables to complete its
CDK Pipelines deployment:

- `PIPELINES_OAUTH_TOKEN_NAME` — the **secret name** you've given above,
- `PIPELINES_SOURCE_OWNER` - the Github username where your repository is located,
- `PIPELINES_SOURCE_REPOSITORY` - the name of your repository, and
- `PIPELINES_SOURCE_BRANCH` - the branch you want to track.

If we take this current repository as an example, and we want our continuous delivery
pipeline to automatically deploy all changes made in our `staging` branch, we'll have
to set the following values:

| Environment variable          | Value                              |
| ----------------------------- | ---------------------------------- |
| `PIPELINES_OAUTH_TOKEN_NAME`  | ≪ your secret name ≫               |
| `PIPELINES_SOURCE_OWNER`      | `aws-samples`                      |
| `PIPELINES_SOURCE_REPOSITORY` | `aws-cdk-lambda-automated-testing` |
| `PIPELINES_SOURCE_BRANCH`     | `staging`                          |

You can set these environment variables however you wish as dictated by your system.
To make this more convenient, the codebase will take in env var values you provide in
a `.env` file, if it exists. See `.env.sample` for a template you can use.

> **Important**: If you create an `.env` file, it is strongly recommended not to
> check this into your code repository. This codebase is configured to ignore the
> `.env` file from `git` by default to help enforce this.

#### — Deploy the pipeline —

Once all that's done and dusted, we can create the CDK Pipeline now:

```bash
yarn cdk deploy
```

This creates the continuous delivery pipeline on your account using [AWS CodePipeline][aws-codepipeline].
Once the pipeline is created, it will start its first deployment right away.
You can monitor the progress of that deployment on your [AWS CodePipeline console][codepipeline-console].

From this point on, whenever you want to make a change to the application itself,
you only need to modify the code in the Github repository you provided (either via a
direct push, or through a pull request, etc.), and the continuous delivery pipeline
will always keep your application updated automatically. **You don't need to run
`yarn cdk deploy` again unless you explicitly want to change the delivery pipeline itself**.

If you want to cleanup and remove the entire pipelines deployment, just run:

```bash
yarn cdk destroy
```

---

## Security

See [CONTRIBUTING](./contributing.md) for more information.

## License

This project is licensed under the MIT-0 license.

[lambda]: https://aws.amazon.com/lambda
[cdk]: https://aws.amazon.com/cdk
[iac]: https://docs.aws.amazon.com/whitepapers/latest/modern-application-development-on-aws/managing-infrastructure-as-code.html
[jest]: https://jestjs.io
[dynamodb]: https://aws.amazon.com/dynamodb
[eventbridge]: https://aws.amazon.com/eventbridge
[cdk-init]: https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html#typescript-newproject
[aws-cdk]: https://www.npmjs.com/package/aws-cdk
[cdk-bootstrapping]: https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html
[cdk-pipelines]: https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/
[github-pat]: https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
[aws-secretsmanager]: https://aws.amazon.com/secrets-manager
[aws-sm-console]: https://console.aws.amazon.com/secretsmanager
[aws-codepipeline]: https://aws.amazon.com/codepipeline
[codepipeline-console]: https://console.aws.amazon.com/codepipeline
