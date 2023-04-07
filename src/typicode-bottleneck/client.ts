import { Connection, Client } from '@temporalio/client';
import { typicodeThrottle } from './workflows';
import { v4 as uuidv4 } from 'uuid';

async function run(customerId: string) {
  const connection = await Connection.connect();

  const client = new Client({
    connection
  });

  const handle = await client.workflow.start(typicodeThrottle, {
    args: ['test'],
    taskQueue: 'data-fetch-throttle',
    workflowId: customerId,
  });
  console.log(`Started workflow ${handle.workflowId}`);

  console.log(await handle.result());
}

run(uuidv4()).catch((err) => {
  console.error(err);
  process.exit(1);
});