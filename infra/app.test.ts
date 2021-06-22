/**********************************************************************************************************************
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance        *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *       http://aws.amazon.com/asl/                                                                                   *
 *                                                                                                                    *
 *  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 **********************************************************************************************************************/
import * as cdk from '@aws-cdk/core'
import { SynthUtils } from '@aws-cdk/assert'

import { app } from './app'

// :: ---

it('synths without errors', () => {
  const stacks = app.node.children.filter((child) => child instanceof cdk.Stack)

  for (const stack of stacks) {
    SynthUtils.toCloudFormation(stack as cdk.Stack)
  }
})
