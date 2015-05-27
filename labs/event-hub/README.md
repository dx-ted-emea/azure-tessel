Using EventHubs for sending telemetry at high scale
===================================================
_Many modern solutions are faced with the challenge of how to securely and reliably ingest very large amounts of information from many concurrent publishers. Microsoft Azure EventHubs is a managed platform service that provides a foundation for large-scale data ingestion in a broad variety of scenarios. Examples of such scenarios are behavior tracking in mobile apps, traffic information from web farms, in-game event capture in console games, or telemetry data collected from industrial machines or connected vehicles. The common role that EventHubs plays in solution architectures is that it acts as the “front door” for an event pipeline, often called an event ingestor. An event ingestor is a component or service that sits between event producers and event consumers to decouple the production of an event stream from the consumption of those events._

You'll create an EventHub with the required configuration and security settings using the Microsoft Azure Portal or custom code using Visual Studio. Afterwards you will send telemetry from your Tessel microcontroller to this EventHub. 


Prerequisites
-------------
In order to successfully complete this lab you need to:

* Required: Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Optional: If you want to configure and create the EventHub by code, an installation of Visual Studio with the Azure SDK is required. (When you create and configure the EventHub by using the Azure portal this is not necessary)
You can [download](http://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx) a free version of Visual Studio. The Azure SDK can be downloaded [here](http://azure.microsoft.com/en-us/downloads/)
* Recommended: If you want to view the messages send to EventHub, you can use tools like the Service Bus Explorer.
You can [download](https://code.msdn.microsoft.com/windowsazure/Service-Bus-Explorer-f2abca5a) the Service Bus Explorer. _If you are running on a non Windows machine and want to use the Service Bus Explorer, you could spin up a virtual machine running Windows in Azure and install it there_


Instructions (using the Azure Portal to create an EventHub)
------------------------------------------------------------

Use the [Azure Portal](https://manage.windowsazure.com) for the creation and configuration of the EventHub.
You will: 

* Create a new Service Bus Namespace
* Create a new EventHub within the created Service Bus Namespace
* Create the necessary credentials for accessing the EventHub

Later in the lab we will see how the same configuration can be done from C# code within a console application running on-premise.

### Creating a new Azure Service Bus namespace

* Start by logging in to the [Azure Portal](https://manage.windowsazure.com).
* Click "+ NEW", located in the lower left corner and select: App Services -> Service Bus -> EventHub -> Quick Create
![Service Bus Creation Screenshot](images/01_CreateSBNamespace.png)
* Fill in an unique Event Hub Name of your choice (How about "YourInitials + EH")
* Select a region
* Fill in a Namespace Name or leave the automatically created name. This name will be part of the URI which uniquely identifies your EventHub (How about "YourInitials + -ns")
* Click on "CREATE A NEW Event Hub"

When ready, you'll see "Active" in the status column of your new created EventHub

* Click on your EventHub Namespace in the column "Namespace Name"
* Familiarize yourself with the information. From here you have shortcuts to tutorials, tools etc.
* Click on "EventHubs" at the top of the screen
![Event Hub Screenshot](images/02_ConfigureEventHub_01.png)
* Click on the name of your EventHub in the column "NAME"

You see a dashboard that gives you more information about the created EventHub like the connection string, the EventHub Url etc.

* Click on "CONFIGURE" at the top of the page
![Event Hub Screenshot](images/02_ConfigureEventHub_02.png)

* You find information on the MESSAGE RETENTION (default is 1 day), the STATE of the EventHub and the PARTITION COUNT
* In the lower part of the page you see a section called "shared access policies". 
	* Create a new entry by entering a policy name (the name is up to you; How about "SendRights")
	* Select "Send"and "Listen" as permissions
	* Click "Save" at the bottom of the page

  You will find your new Policy in the "Shared access key generator" section
  	* Copy the "PRIMARY KEY" and store it for further usage

Congratulations! You have created and configured your first EventHub using the Azure Portal


Instructions (Creating / Configuring EventHub using C#)
--------------------------------------------------------

__Optionally if you want to create an EventHub by using C# in an on-premise console application follow these instructions.__
Please be aware; this steps are not mandatory if you have already created the EventHub using the Azure Portal. We will reuse the already created Service Bus Namespace and will add a second EventHub to the Namespace.

We will: 

* Add a new EventHub within the already created Service Bus Namespace
* Create the necessary credentials for accessing the EventHub

### Start Visual Studio

* Start Visual Studio on your computer 
* Create a new console application by clicking FILE -> NEW -> PROJECT and select "Console Application" from the screen
* Give the solution a meaningful name (How about: "MyEventHubCreator")
![Visual Studio Screenshot](images/04_CreateSolution.png)


### Write the code to create the EventHub
* After the solution is created for you, open the "Package Manager Console". If you can't locate it, go to VIEW -> OTHER WINDOWS -> PACKAGE MANAGER CONSOLE
* Execute the command: 

	 - Install-Package WindowsAzure.ServiceBus

The necessary Nuget packages to interact with Service Bus and EventHub will be downloaded and added to your solution.

Let's start coding and create the EventHub by code

* Replace your auto generated Main function with the code from [api/Program.cs](api/Program.cs).
* Replace "Please Provide Your Service Bus Namespace" with the name of your Service Bus Namespace.
* Replace "Please Provide Your Service Bus Shared Access Key" with the Shared Access Key from your Service Bus Namespace. _You can find the key in the Azure Portal by clicking "CONNECTION INFORMATION" on the bottom of your page. Please take care that you request the connection information for the Service Bus Namespace and not for the already created EventHub._ 
![Service Bus Connection Screenshot](images/05_GetConnectionInfo_01.png)
  
The provided connection string looks similiar to:
```
	Endpoint=sb://yournamespace.Service Bus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Va---removed characters---t6+I=
````

* Copy the value of SharedAccessKey into your code
* Add the following two using statements to your code at the top of the .cs file:

	* using Microsoft.ServiceBus;
	* using Microsoft.ServiceBus.Messaging;

* Build the application and step through the application

Congratulations! You have created your second EventHub using a C# application.

### Connecting Tessel to the new created EventHub

Now call the EventHub from our Tessel to ingest data. The sample code is located in the [tessel](tessel) folder. 

* Open the file [blinky-EventHub.js](tessel/blinky-EventHub.js), examine the code and replace the following values with the values of your EventHub:
* namespace
* hubname (If you created the EventHub with the provided C# code it's: 'eventhubcreatedwithcode')
* deviceName (this is an identifier for your device)
* eventHubAccessKeyName (If you created the EventHub with the provided C# code it's: 'EventHubKey')

In order to secure the communication with the EventHub we have to provide a so called "Shared Access Signature Token" in each request from the Tessel to the EventHub. You can create such a "Shared Access Signature Token" with a web tool or the Node.js application which is provided [tessel](tessel) folder.

* To generate the SAS token from the web tool go to: http://eventhubssasgenerator.azurewebsites.net/

* Open the file [CreateSASToken.js](tessel/CreateSASToken.js)" and provide the same values that you used in the blinky-EventHub.js for 
	* namespace
	* hubname
	* deviceName
	* eventHubAccessKeyName
	
	* eventHubAccessKey
	If you don't remember the key you can find the value for eventHubAccessKey in the Azure portal (See: 'Copy the "PRIMARY KEY" and store it for further usage')

* In the console run the Node.Js application:

	```
	node CreateSASToken
	```
	
* Copy/paste the Shared Access Signature token which is shown at the console into your blinky-EventHub.js application. Make sure you remove any CR/LF after you copied the signature from the console window. Just leave the URL Encoded characters. Your SAS token should look something like this:
	```
	SharedAccessSignature sr=https%3A%2F%2Fyournamespace.servicebus.windows.net%2FyourEventHub%2Fpublishers%2Fmytessel%2Fmessages&sig=hrv---removed characters----QtQ%3D&se=1417774602&skn=SendRights
	```

* Locate the line which is marked: "// Payload to send" in the blinky-EventHub.js code. This is the json formatted payload you are going to send to EventHub. Change it to what you like to send. 

* Now it's time to run your application. Just key in the following commands:

	```Javascript
	tessel run blinky-EventHub.js
	```

You will see some output on the console and an http response code of "201 Created" meaning your request to EventHub has been fulfilled and resulted in a new "resource" being created. 

Congratulations! You have used EventHub. 


### Optional: Using Service Bus Explorer to see the results of your ingests

If you want proove that your messages are "inside" of EventHub and waiting for further processing you can use the "Service Bus Explorer" (check the prerequisites section of this document). 
* Just start "Service Bus Explorer" and connect it using the Service Bus Connection string (provided by the Azure portal). Take care to use the Connection String to the ServiceBus namespace instead of the connection string to the EventHub. After the connection is sucessfull established you see your created EventHub(s).
![Service Bus Explorer](images/06_SBExplorer_01.png)
* Identify the Partition which has a "End Sequence Number" different than -1 or 0 and "right click" on this partition
* Select "Create Partition Listener"
* In the new window click on "Start" in the right lower area.
![Service Bus Explorer](images/06_SBExplorer_02.png)
* If you now click on "Events" you can see all telemetry data which was send from your Tessel to the EventHub.
![Service Bus Explorer](images/06_SBExplorer_03.png)


### Extra Workout

* Host the creation of the Shared Access Signature in an Azure WebSite Rest Api and call it from the Tessel before you communicate with EventHub.
* Create a program to read the telemetry data from the EventHub

Summary
-------
You have:

* Created an EventHub inside of Service Bus
* Created a Shared Access Signature to access your EventHub
* Deployed a Node.js program to your Tessel that sends telemetry data to the EventHub

__Go ahead and play with the solution. Tweak it, extend it, use it in a bigger context. Have fun!__

More information
----------------
[Azure Service Bus](http://azure.microsoft.com/en-us/documentation/services/service-bus/#node)    
[EventHub](http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx)    
[Shared Access Signature](http://msdn.microsoft.com/en-us/library/azure/jj721951.aspx)    

