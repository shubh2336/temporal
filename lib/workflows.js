"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example = void 0;
const workflow_1 = require("@temporalio/workflow");
const { greet } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '1 minute',
});
/** A workflow that simply calls an activity */
async function example(name) {
    return await greet(name);
}
exports.example = example;
