var azure = require('azure-storage');
var tableSvc = azure.createTableService();

// http://<mymobileservicename>.azure-mobile.net/api/table_connection_info?deviceId=<deviceId>

exports.get = function(request, response) {
    // Handle incomming request to retrieve weather configuration
                
    // Set default configuration values

    var configRefreshAfter = 3; // Do X number of measurements then renew config
    var delayBetweenMeasurements = 10000; // Delay measurements by X ms
    var azureStorageAccount = 'not-set'; // Storage Account Name, should be overridden below by environment variable
    var tableName = 'weatherlogs'; // Table to write logs to
    
    // Override default values if other values have been set using the management portal

    if (process.env.CONFIG_REFRESH_AFTER) { configRefreshAfter = process.env.CONFIG_REFRESH_AFTER; }
    if (process.env.DELAY_BETWEEN_MEASUREMENTS) { delayBetweenMeasurements = process.env.DELAY_BETWEEN_MEASUREMENTS; }
    if (process.env.AZURE_STORAGE_ACCOUNT) { azureStorageAccount = process.env.AZURE_STORAGE_ACCOUNT; }
    if (process.env.TABLE_NAME) { tableName = process.env.TABLE_NAME; }
    
    var deviceId = request.query.deviceId;
    
    if (authorizeDevice(deviceId)) {    
        console.info('Authorized request:', deviceId);
        
        // Create the Shared Access Signature according to configuration
    
        var now = new Date();
        var sasExpiryDate = new Date(now);
        sasExpiryDate.setMinutes(now.getMinutes() + 30);
    
        // Expirey date sets to now + 30 minutes. New configuration need to be read before that.
        console.info('Expiry Date set to:', sasExpiryDate);
        
        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: 'a', // a = add rows
                Expiry: sasExpiryDate
            },
        };
        
        var sas = tableSvc.generateSharedAccessSignature(tableName, sharedAccessPolicy);
        
        // Register the address of the Storage Account
    
        var host = tableSvc.host;
        
        // Return configuration to caller
    
        var config = {
            authorized: true,
            refreshConfigAfterNo: configRefreshAfter,
            delayBetweenMeasurements: delayBetweenMeasurements,
            azureStorageAccount: azureStorageAccount,
            tableName: tableName,
            sas: sas,
        };
        
        response.send(statusCodes.OK, config);
    } else {
        console.warn('Unauthorized request:', deviceId);
        
        // deviceId wasn't allowed to access
        
        response.send(statusCodes.UNAUTHORIZED, {
            authorized: false,
            message: 'deviceId was not provided or has been refused access'
        });
    }
};

function authorizeDevice(deviceId) {
    // Implement logic to check if device is allowed to send data or not

    // WARNING! This is just a sample implementation and does not by any
    // means show how authentication and authorization of devices should
    // be handled.

    // For this lab, approve all deviceIds as long as it is provided
    
    if (deviceId) {
        return true;
    } else {
        return false;
    }
}