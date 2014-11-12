var crypto = require('crypto');

// ServiceBus parameters
var namespace = '<Your-ServiceBus-Namespace>';
var queue ='<Your-Queue>';
var AccessKeyName = '<Your-AccessKey-Name>';
var AccessKey = '<Your-AccessKey>';


// Full ServiceBus Queue publisher URI
var ServiceBusUri = 'https://' + namespace + '.servicebus.windows.net' + '/' + queue;
 
function createSASToken(uri, keyName, key)
{
    //Token expires in December
    var expiry = '1417774602';
 
    var signedString = encodeURIComponent(uri) + '\n' + expiry;
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(signedString);
    var signature = hmac.digest('base64');
    var token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + keyName;
 
    return token;
}
 
var createdSASToken = createSASToken(ServiceBusUri, AccessKeyName, AccessKey)
console.log(createdSASToken);


