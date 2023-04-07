"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@temporalio/client");
const workflows_1 = require("./workflows");
const nanoid_1 = require("nanoid");
async function run() {
    // Connect to the default Server location (localhost:7233)
    const connection = await client_1.Connection.connect();
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }
    const client = new client_1.Client({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });
    const handle = await client.workflow.start(workflows_1.example, {
        // type inference works! args: [name: string]
        args: ['Temporal'],
        taskQueue: 'hello-world',
        // in practice, use a meaningful business ID, like customerId or transactionId
        workflowId: 'workflow-' + (0, nanoid_1.nanoid)(),
    });
    console.log(`Started workflow ${handle.workflowId}`);
    // optional: wait for client result
    console.log(await handle.result()); // Hello, Temporal!
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
