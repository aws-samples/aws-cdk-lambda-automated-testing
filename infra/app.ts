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
