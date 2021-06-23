/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as actions from '@aws-cdk/aws-codepipeline-actions'

// :: ---

export interface SourceActionProps {
  outputArtifact: codepipeline.Artifact
}

class SourceAction extends cdk.Construct {
  action: actions.Action

  constructor(scope: cdk.Construct, id: string, props: SourceActionProps) {
    super(scope, id)

    // :: Change this to match your choice of source code provider.
    this.action = new actions.GitHubSourceAction({
      actionName: 'github-branch-updated',
      output: props.outputArtifact,

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      // :: Set the following values through your environment variables,
      //    or through a `.env` file.
      //    See `.env.sample` for an illustration of how to write a `.env` file.
      oauthToken: cdk.SecretValue.secretsManager(
        process.env.PIPELINES_OAUTH_TOKEN_NAME!
      ),
      owner: process.env.PIPELINES_SOURCE_OWNER!,
      repo: process.env.PIPELINES_SOURCE_REPOSITORY!,
      branch: process.env.PIPELINES_SOURCE_BRANCH!,
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    })
  }

  onValidate(): string[] {
    const messages: string[] = []

    // :: owner, repo, and branch information must all be set.
    if (!process.env.PIPELINES_SOURCE_OWNER) {
      messages.push('Source action [owner] property is not set.')
    }

    if (!process.env.PIPELINES_SOURCE_REPOSITORY) {
      messages.push('Source action [repo] property is not set.')
    }

    if (!process.env.PIPELINES_SOURCE_BRANCH) {
      messages.push('Source action [branch] property is not set.')
    }

    return messages
  }
}

export default SourceAction
