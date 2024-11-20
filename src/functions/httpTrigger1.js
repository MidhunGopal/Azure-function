const { app } = require('@azure/functions');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const account = "storagedemofunction";
const accountKey = "   ";
const tableName = "demoTable";
const credential = new AzureNamedKeyCredential(account, accountKey);
const tableClient = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);
app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const operation = request.query.get('operation');
        context.log(`Http function processed request for url "${request.url}"`);
        context.log(`name "${operation}"`);
        if (operation === "save") {
            context.log(`save`);
            const entity = {
                partitionKey: "partition1",
                rowKey: "row2", name: "Midhun Gopal",
                age: 30
            };
            context.log(`entity "${entity}"`);
            await tableClient.createEntity(entity);
            return { body: `Entity saved successfully` };
            context.res = {
                status: 200,
                body: "Entity saved successfully"
            };
        } else if (operation === "retrieve") {
            context.log(`retrieve`);
            const response = await tableClient.getEntity("partition1", "row2");
            return { body: `retrieve successfully"${response.name}" `};
            context.res = {
                status: 200,
                body: entity
            };
        }
        else {
            return { body: `Please specify a valid operation (save or retrieve)` };
            context.res = {
                status: 400,
                body: "Please specify a valid operation (save or retrieve)"
            };
        }
    }
});
