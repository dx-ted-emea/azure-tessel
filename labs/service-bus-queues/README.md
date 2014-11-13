Send messages from Tessel to Service Bus Queue
=============
_Asynchronous messaging patterns are the architectural cornerstone of reliable and scalable applications. Integrating cloud resources with Service Bus messaging ensures smooth operation under heavy and variable load with durability to survive intermittent failures. You can read the following article about what Service Bus Queue is and how to use it with node.js [ How to Use Service Bus Queues ](http://azure.microsoft.com/en-us/documentation/articles/service-bus-nodejs-how-to-use-queues/)_

In this lab you will learn how to use Service Bus Queues by creating a Tessel app that puts (enqueue) messages in a Queue using the REST API. Next a consumer app will get (dequeue) the message from the queue using the Azure node.js SDK.


Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Have installed the [Azure Node.js SDK](http://azure.microsoft.com/en-us/develop/nodejs/)


Instructions
------------
In this lab you build a program that runs on your Tessel. When pressing the config button on the Tessel microcrontroller a message is put in a ServicevBus queue. Next you will create a node.js app using the Azure node.js SDK to consume the messages from the queue and display the raw messages.

The Config button is next to the leds on your Tessel device. In the picture below the Config button is marked in a blue.
![config button](images/ConfigButton.PNG)


The code for this lab includes the following files:
* CreateSASToken.js - The code for getting the authentication credentials from ServiceBus
* button_sbqueue_sas.js - The tessel app, whenever the Config button is being pushed a message is sent to the ServiceBus Queue.
* readSBQueue_setconnection.js - Check if there are any message in the ServiceBus Queue and dispaly its raw data.
* ambient_sbqueue_sas.js - This is another example for putting a message in ServiceBus Queue, you can use it if you own the [Tessel Ambient Module](https://tessel.io/modules#module-ambient), but this is not required in order to complete this lab.


### Create the Azure Service Bus Queue

* Go to the [Azure Managment Portal](https://manage.windowsazure.com), in the bottom left corner click the "+NEW" button. Select "APP SERVICES" -> "SERVICE BUS" -> "QUEUE" -> "CUSTOM CREATE".
![Create ServiceBus NS](images/newsb.PNG)

* In the "Add a new queue" dialog box, insert the following details:
  * QUEUE NAME - give a name to your queue
  * REGION - select the region you want to deploy in
  
  You need a Service Bus namespace to work with Queues, you use an existing namespace or create a new one
  * NAMESPACE - select Create a new namespace
  * NAMESPACE NAME - give your namespace a name
![Create ServiceBus Queue](images/addqueue.PNG)

* Just confirm the settings in the second screen

### Create the authentication credentials
_Applications can authenticate to Microsoft Azure Service Bus using either Shared Access Signature (SAS) authentication, or by authenticating through Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS). In this lab we use SAS authentication._

You will create a SAS Token that you will use later to authenticate from the Tessel device to ServiceBus.

* Go to [Azure Managment Portal](https://manage.windowsazure.com), in the menu on the left select "SERVICE BUS".
* Select the Namespace you created.

![ServiceBus](images/menusb.PNG)

* On the top menu select QUEUES.

![ServiceBus](images/yourqueue.PNG)

* Select the QUEUE to go to the details screen
* Go to the CONFIGURE tab and go to the section "Shared access policies" 
* Create a new policy, enter a name and select the "Manage" permission
* Save it by pressing the SAVE button at the bottom of the page

![ServiceBus](images/createtoken.PNG)

* Go to the section "Shared access key generator" 
* Select your Policy and copy the PRIMARY KEY
* Save this key, you will use it later in this lab

![ServiceBus](images/getsas.PNG)


### Create the Node.js app to read messages from Service Bus QUEUE
You will create an app, that consumes the messages by reading from the queue and displaying the message raw data.
This app is running on your desktop so you will use the [Azure Node.js SDK](http://azure.microsoft.com/en-us/develop/nodejs/).

* Open the file [readSBQueue_setconnection.js](../readSBQueue_setconnection.js) in a text editor.
* Look for the lines below and put in your ServiceBus connection string (sbConnection) and Queue name (queue). 

```javascript
	var sbConnection = '<your-servicebus-connection-string>';
	var queue = '<your-queue-name>';
```

To get the ServiceBus Connection String:
* In the [Azure Managment Portal](https://manage.windowsazure.com) Select Service Bus, go to your Namespace and select your Queue. Press the button named "CONNECTION INFORMATION".

![ServiceBus Connection Information](images/coninfobutton.PNG)

* Copy the CONNECTION STRING for the policy you created.

![ServiceBus Connection Information](images/coninfo.PNG)


* Open the Node.js command prompt and change directory to the location of readSBQueue_setconnection.js.
* Install the azure module and save the dependency to a package.json file

```javascript
	npm install azure --save
```

* Run the readSBQueue_setconnection.js with node.

```javascript
	node readSBQueue_setconnection.js
``` 
	
When the app is running it waits for messages in the Queue, when it recives a message it will dispaly its raw data, for example:

```javascript
	{ body: 'button pressed on tessel',
  	  brokerProperties:
   	    { DeliveryCount: 1,
     		EnqueuedSequenceNumber: 0,
     		EnqueuedTimeUtc: 'Wed, 12 Nov 2014 10:31:36 GMT',
     		MessageId: 'dd20ae5468424d7a854baed268d9ee63',
     		PartitionKey: '124',
     		SequenceNumber: 9288674231451648,
     		State: 'Active',
     		TimeToLive: 1209600 },
  	    contentType: 'application/atom+xml;type=entry;charset=utf-8' }
 ```
  	
There are no messages in the queue so nothing is printed to the console. Leave this app running, when you will put messages in the queue from the tessel you'll see it in this console.

#### Get the SAS Token for the Tessel code
You will get the SAS Token you should send for the ServiceBus from the Tessel for authentication.

* Open the file [CreateSASToken.js](../CreateSASToken.js) in a text editor.
* Look for the lines below and put in 
	* The POLICY NAME you created as the AccessKeyName
	* The key you retrieved before as the AccessKey

```javascript
	//ServiceBus parameters
	var namespace = '<Your-ServiceBus-Namespace>';
	var queue ='<Your-Queue>';
	var AccessKeyName = '<Your-AccessKey-Name>';
	var AccessKey = '<Your-AccessKey>';
```

* Open a Node.js command prompt and change diretcory to the location of CreateSASToken.js. Run the CreateSASToken.js with node.

```javascript
	node CreateSASToken.js
```

Copy and save the output string, you will use it later in this lab. Make sure you remove all the line breaks after copying

### Create and Run the Tessel App
You will create a program that runs on the Tessel. When the Config button is pushed it will put a message in the Service Bus Queue.

* Open the file [button_sbqueue_sas.js](../button_sbqueue_sas.js) in a text editor
* Look for the lines below and put in 
	* your Service Bus namespace
	* your Queue name
	* the SASToken you retrieved as the Key parameter

```javascript
	//Service Bus Parameters
	var namespace = '<your-servicebus-namespace>';
	var queue = '<your-queue-name>';
	var Key = '<your-SAS-key>';
```

Make sure your Tessel device is plugged in, and has a WIFI connection.

* Open a Node.js command prompt and change directory to the location of button_sbqueue_sas.js
* Run the App: 

```javascript
	tessel run button_sbqueue_sas.js
```

* When the App is deployed and running on the Tessel, press the Config button on the Tessel device.

Upon a succesful deployment, in the command window running the button_sbqueue_sas.js code you will see:

```
	putMessageInQueue:statusCode:  201
```
	
On the command window running the readSBQueue_setconnection.js code:

```
	{ body: 'button pressed on tessel',
  	  brokerProperties:
   	    { DeliveryCount: 1,
     		EnqueuedSequenceNumber: 0,
     		EnqueuedTimeUtc: 'Wed, 12 Nov 2014 10:31:36 GMT',
     		MessageId: 'dd20ae5468424d7a854baed268d9ee63',
     		PartitionKey: '124',
     		SequenceNumber: 9288674231451648,
     		State: 'Active',
     		TimeToLive: 1209600 },
  	    contentType: 'application/atom+xml;type=entry;charset=utf-8' }
```

Summary
-------
You have:

* Created a Service Bus Namespace and a Queue in this Namespace.
* Used the CreateSASToken.js tool to generate a SAS token (you can also use this for Service Bus Topics, Events Hub and Notification Hub)
* Used the [Azure Node.js SDK](http://azure.microsoft.com/en-us/develop/nodejs/)
* Deployed a program to the Tessel device that sends messages to ServiceBus Queue using REST API.
* Read a message from the Queue


__Go ahead and play with the solution. Tweak it, extend it, use it in a bigger context. Have fun!__

More Information
----------------
* [Shared Access Signature Authentication with Service Bus](http://msdn.microsoft.com/en-us/library/azure/dn170477.aspx)
* [ How to Use Service Bus Queues ](http://azure.microsoft.com/en-us/documentation/articles/service-bus-nodejs-how-to-use-queues/)
* [Azure Node.js SDK](http://azure.microsoft.com/en-us/develop/nodejs/)

