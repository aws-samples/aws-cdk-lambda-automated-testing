/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'

import DataStore from '@stacks/data-store'
import Timekeeper from '@stacks/timekeeper'
import Environment from '@infra/environment'

// :: ---

class AppStackset {
  constructor(scope: cdk.Construct) {
    const COMMON_ENVIRONMENT: cdk.Environment = {
      region: Environment.REGION,
    }

    const datastore = new DataStore(scope, 'datastore', {
      env: COMMON_ENVIRONMENT,
    })

    new Timekeeper(scope, 'timekeeper', {
      env: COMMON_ENVIRONMENT,
      timetable: datastore.table,
    })
  }
}

export default AppStackset
