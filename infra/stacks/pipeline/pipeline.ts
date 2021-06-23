/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'
import * as pipelines from '@aws-cdk/pipelines'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as actions from '@aws-cdk/aws-codepipeline-actions'

import SourceAction from './resources/source-action'

// :: ---

export interface PipelineProps extends cdk.StackProps {
  //
}

class Pipeline extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: PipelineProps) {
    super(scope, id, props)

    // :: These will temporarily hold pipeline artifacts as the process
    //    flows from stage to stage.
    const sourceArtifact = new codepipeline.Artifact()
    const cloudAssemblyArtifact = new codepipeline.Artifact()

    const sourceAction = new SourceAction(this, 'source-action', {
      outputArtifact: sourceArtifact,
    })

    new pipelines.CdkPipeline(this, 'cdk-pipeline', {
      pipelineName: 'sample-application-pipeline',
      cloudAssemblyArtifact,

      sourceAction: sourceAction.action,
      synthAction: pipelines.SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // :: These will make sure the source passes validation before
        //    it is actually deployed.
        //    See `package.json` for what these scripts perform.
        testCommands: ['yarn lint', 'yarn test'],
      }),
    })
  }
}

export default Pipeline
