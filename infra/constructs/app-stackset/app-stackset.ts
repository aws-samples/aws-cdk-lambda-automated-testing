/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import * as cdk from '@aws-cdk/core'

import DataStore from '@stacks/data-store'
import Timekeeper from '@stacks/timekeeper'
import Environment from '@infra/environment'

// :: ---

class AppStackset extends cdk.Construct {
  constructor(app: cdk.App, id: string) {
    super(app, id)

    // :: ---

    const COMMON_ENVIRONMENT: cdk.Environment = {
      region: Environment.REGION,
    }

    const datastore = new DataStore(app, 'datastore', {
      env: COMMON_ENVIRONMENT,
    })

    new Timekeeper(app, 'timekeeper', {
      env: COMMON_ENVIRONMENT,
      timetable: datastore.table,
    })
  }
}

export default AppStackset
