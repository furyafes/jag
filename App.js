const { BaseClient } = require("./module/lib/BaseX");


const client = global.client = new BaseClient();

client.handleApplication()