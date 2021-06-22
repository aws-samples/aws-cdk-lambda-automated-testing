import * as cdk from '@aws-cdk/core'
import * as ddb from '@aws-cdk/aws-dynamodb'

// :: ---

export interface DataStoreProps extends cdk.StackProps {
  // :: TODO
}

class DataStore extends cdk.Stack {
  table: ddb.Table

  constructor(scope: cdk.Construct, id: string, props?: DataStoreProps) {
    super(scope, id, props)

    this.table = new ddb.Table(this, 'history-table', {
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: ddb.AttributeType.STRING,
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    })
  }
}

export default DataStore
