import { Connection, Client } from '@temporalio/client';
import { hello } from './workflows';
import { v4 as uuidv4 } from 'uuid';

async function run(customerId: string): Promise<void> {
  const connection = await Connection.connect();

  const client = new Client({
    connection,
  });

  const handle = await client.workflow.start(hello, {
    args: ['World'],
    taskQueue: 'hello-world',
    workflowId: customerId,
  });
  console.log(`Started workflow ${handle.workflowId}`);

  console.log(await handle.result());
}

run(uuidv4()).catch((err) => {
  console.error(err);
  process.exit(1);
});