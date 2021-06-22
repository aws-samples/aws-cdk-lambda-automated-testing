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
import 'dotenv/config'
import 'source-map-support/register'

import * as cdk from '@aws-cdk/core'
import DataStore from '@stacks/data-store'
import Timekeeper from '@stacks/timekeeper'

import Environment from './environment'

// :: ---

export const app = new cdk.App()
const COMMON_ENVIRONMENT = { region: Environment.REGION }

const datastore = new DataStore(app, 'datastore', {
  env: { ...COMMON_ENVIRONMENT },
})

new Timekeeper(app, 'timekeeper', {
  env: { ...COMMON_ENVIRONMENT },
  timetable: datastore.table,
})
