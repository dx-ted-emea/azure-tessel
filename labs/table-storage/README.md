Uploading structured data to Azure Table Storage
================================================
Azure Table Storage is a NoSQL Database hosted in Azure, designed to store massive amounts of structured data and to handle high load. Creating custom APIs using Mobile Services, Azure Websites or Virtual Machines might be the first you think about, but other services can be used independently or in combination with those custom APIs. Having your clients make direct calls to Azure Table Storage will reduce load on your services. Although offloading other services, there are some tradeoffs. Since the clients are writing data directly to Azure Table Storage, you lose some control on the data that gets pushed to your service and you have to implement that in other ways, like using an asynchronous pattern to validate and clean up data. If storing structured data is what you are looking for, then you should definitively consider Azure Table Storage. This lab will show you the basics.

During this lab you’ll build a weather monitoring device simulator that registers and sends temperature and humidity information to the cloud.

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Required: have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Recommendation: the lab [Creating and Calling a Custom REST API with Azure Mobile Services](../mobile-services) will provide additional information about how you can create and host a custom RESTful Web API on Azure Mobile Services. Doing that lab before this one might be beneficial and shows other way of working with Mobile Services than what is used in this lab.

Instructions
------------
_Azure Table is one of the components of the service called Azure Storage. By default Azure Table is secured and you can't access it without the storage account name and key. The storage account name should be considered public knowledge, but the storage account key should be handled with extreme care and is something you shouldn't share with any external clients. If you do get your hand on a valid storage account name and key you are in fact administrator of that storage account and can create, read, update and delete tables and data stored in the tables. In fact with those credentials you have full administrative rights to the storage account you can also execute requests against the other storage components included in Azure Storage, such as Blobs, Queues and Files. Therefore handing out the storage account key to any client that is not under your direct control is an extremely important “Anti Pattern” (something you shouldn’t do)._

__How to give external clients access to services within a Storage Account without supplying the storage account key?__

_You can use a technique that is called: [Shared Access Signature, SAS](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/). With SAS you can give temporary usage rights to different resources in a Storage Account. For example, you can generate a SAS that gives a client temporary rights to create, read, update or delete data in a specific table in Azure Tables. Sounds all good, right? The problem here is that you need the storage account name and key in order to generate the SAS, hence it has to be generated at a safe and controlled location such as in a service controlled by you._

### Execution flow

In this lab you're going to host a service on Microsoft Azure Mobile Services that will provide your Tessel with configuration and a Shared Access Signature that will grant the Tessel permissions to write/add rows directly to Azure Table Storage.

1. Tessel calls API to retrieve configuration and SAS
2. SAS is saved locally on the Tessel device and is used for several writes directly against Azure Table Storage
3. After a configurable amount of measurements, the Tessel will call the API to retrieve new configuration and a new SAS before the old one expires. This gives you control over the Tessel and your storage account, you can invalidate the SAS for a particular device quite easy.

### Setting up Azure

There are two components you need to setup in Azure to have everything working: storage and hosting.

#### Create a storage account

During this part of the lab you use the Azure-CLI (Azure x-Plat Tools), even though you can easily do the same thing using the management portal if you want to.

Open a terminal/console window. Execute the following commands to get insight into what you will do next.

	azure storage account -–help
	azure storage account create --help

When you are ready, execute the following command to create a new storage account. Replace <name> with a globally unique name that you want to use. The command will fail if the name is already taken, so chose something unique, be creative. You can also change the location of the datacenter you want to use. _The recommendation is to put your storage account in the same datacenter as your other services in order to reduce lag and expenses related to data transfers between datacenters._ Chose whatever location you feel appropriate.

	azure storage account create –location "North Europe" <name>

You now have a new storage account created. Remember the name you used, you need it when we refer to the name of your storage account. In order to access that storage account you must retrieve the storage account key. Execute the following command to retrieve the keys.

	azure storage account keys list –help
	azure storage account keys list <name>

Sample output

	PS C:\dev\tessel-azure-labs> azure storage account keys list yournamegoeshere
	info:    Executing command storage account keys list
	+ Getting storage account keys
	data:    Primary ZF2po8rCJk.....DATA-REMOVED-FROM-SAMPLE....4rrt5EN2lK1k2hA==
	data:    Secondary lo+nGo/W.....DATA-REMOVED-FROM-SAMPLE....Pt1orNXRnJjZA7g2w==
	info:    storage account keys list command OK

Copy and save the primary key to a safe location on your computer, we’ll be using it soon.
_These keys can only be accessed if you are administrator of the Azure Subscription that hosts the particular Storage Account and those keys should be handled with care. Don’t give them away to anyone you don’t trust and don’t save them on uncontrolled devices or clients. With any of these keys you have full control over that specific storage account. You can always retrieve the keys again later by executing the same command or though visiting the management portal. If necessary you can also generate new keys, but that will invalidate any other keys already used._

Throughout this lab we’ll be calling into this Storage Account using tools (including Azure-CLI) that accept the name and key of your storage account as input parameters, but they also retrieve them from Environment Variables. The process of saving values in Environment Variables differs in the different operating systems and terminal/command windows/shells. Here are some examples. If you are using another operating system or shell, please search the Internet for information about how to set Environment Variables. Setting environment variables according to this will not persist your changes so if you open a new terminal/command window, restart your computer, etc. your information will be gone:

	// Windows - Command Prompt
	> set <name> = <value>

	// Windows – PowerShell
	> $env:<name> = <value>

	// OS X (Mac) - Terminal
	> export <name> = <value>

	// Linux - Bash
	> export <name> = <value>

Set the Environment Variables: AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY to the name of your storage account and the access key to that storage account respectively.

	// Windows – Command Prompt
	> set AZURE_STORAGE_ACCOUNT = <storage-account>
	> set AZURE_STORAGE_ACCESS_KEY = <key>

	// Windows – PowerShell
	> $env:AZURE_STORAGE_ACCOUNT = <storage-account>
	> $env:AZURE_STORAGE_ACCESS_KEY = <key>

	// OS X / Linux
	> export AZURE_STORAGE_ACCOUNT = <storage-account>
	> export AZURE_STORAGE_ACCESS_KEY = <key>

__This lab description assumes the storage account name and key are set as Environment Variables.__ If you don't succeed or don't want to set the Environment Variables you can also add the storage account name and key manually wherever that is needed.

#### Create and test table in Azure Table Storage

You will pre-create the table and also introduce a small sample tool to read and write some test data from that table.

Open a terminal/console window. Make sure you have downloaded/cloned/copied the contents of this lab locally on your computer and change directory to the "tool" directory.

	cd tool

In this directory you'll fine a Node.js app ([wt.js](tool/wt.js)). You are going to use this app, but first you need to install required Node Modules. The required Node Modules for this project are described in the [package.json](tool/package.json) file. Node.js provides an easy tool for downloading and installing those dependencies "npm". Install the required module(s) by executing the following command:

	npm install

If everything went according to plans you should now be able to execute the command

	> node wt

	Weather Tool, WT
	  for lab: UPLOADING STRUCTURED DATA TO AZURE TABLE STORAGE

	usage: node wt <create | insert | read | clear | delete> [azureStorageAccount] [azureStorageAccessKey]

	Azure storage access need to be provided as parameters or through the following environment
	variables. Look-up how you set Environment Variables for your operating system or pass in
	the credentials as parameters

	Currently using:
	  AZURE_STORAGE_ACCOUNT    : yournamegoeshere
	  AZURE_STORAGE_ACCESS_KEY : ZF2po8rCJk.....DATA-REMOVED-FROM-SAMPLE....4rrt5EN2lK1k2hA==

You will use this tool during the rest of this lab to:

* create table 'weatherlogs'
* insert sample data in table 'weatherlogs'
* read data from table 'weatherlogs'
* clear data from table 'weatherlogs'
* delete table 'weatherlogs' and all data within when you are done

If you have successfully set the Environment Variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY the values will be listed by the tool. If not, you can provide those parameters to this tool manually according to the shown syntax.

Execute the following command to create a new Azure Table in your currently referenced storage account:

	> node wt create

Now you have an empty table created in your storage account. You can start any other program that has access to this table and start reading and writing data to it. But you add some sample data to the table for test first. Execute:

	> node wt insert

	Insert sample data in table

	PartitionKey      :  TM-00-04-f000da30-0061473d-36582586|20141110
	RowKey            :  82576
	Temperature       :  34
	Humidity          :  27
	Sample Weather Log inserted successfully in table weatherlogs

A sample weather log entry has now been inserted into the table and you can see the property values. Execute the same command several times so you'll have several rows inserted into your table. Insert approximately 10 rows before you continue. 

Now read data from our table. Execute the following command to have the Weather Tool connect to your table and retrieve the top 50 rows.

	> node wt read

	Reading top 50 rows from table

	PartitionKey                                    RowKey  Temperature     Humidity

	TM-00-04-f000da30-0061473d-36582586|20141110    82371   -9              83
	TM-00-04-f000da30-0061473d-36582586|20141110    82372   19              82
	TM-00-04-f000da30-0061473d-36582586|20141110    82373   3               13
	...
	...
	...
	TM-00-04-f000da30-0061473d-36582586|20141110    82374   41              35
	TM-00-04-f000da30-0061473d-36582586|20141110    82376   -15             77
	TM-00-04-f000da30-0061473d-36582586|20141110    82576   34              27	

Examine the values and then delete them all by executing:

	> node wt clear
	......

	Table is empty!

You can check that your table is empty if you want to, by again executing the read-command. There is one more command available 'node wt delete', but that command will remove the table completely. Don't execute that command until you are ready with the lab and want to remove all data and the table itself.

##### Small note about PartitionKey and RowKey

_As you have seen when you inserted and read the rows from our Azure Table, all rows had a property called PartitionKey and another one called RowKey. These keys are fully configurable by the user, so they could have been any valid string. The important thing to remember when selecting your Partition and Row Key is:

* PartitionKey and RowKey together form the table's unique identifier that identifies one single row. I.e. you can't have two rows with the same pair of PartitionKey and RowKey.
* Azure Table Storage uses PartitionKey to understand which data needs to be stored close together and which data can be partitioned across boundaries like machines. This all takes place behind the scenes, but rows with different PartitionKeys can be stored on different machines even when saved in the same table.
* Data saved with the same PartitionKey can easily be fetched all at once, while data with different PartitionKeys might need several API Calls in order to get.
* Partition and Row Key are very important for sorting and querying of data. You want to minimize the times where you create a query that involves other properties than those two, since that will involve some kind of 'scan' that will take longer.
* You want to select a PartitionKey that is as specific as possible for your solution in order to gain scalability and speed.

There are more things to know about the PartitionKey and RowKey than we can discuss in this lab, but with a carefully selected algorithm for your keys, Azure Table Storage will be a fast and scalable data storage alternative._

In this sample a PartitionKey is constructed as follows:

	[TesselSerialNo] + | + [year] + [month] + [day]

And a RowKey that is created by calculating the number of seconds left in the day.

	secondsPerDay = 24*60*60
	secondsLeftToday = secondsPerDay - secondsSinceMidnight
	rowKey = padLeft(secondsLeftToday, 5) // Fill out with zeros

This pair of PartitionKey and RowKey will give you a table where you never will have too large partitions since every device uses a new PartitionKey for each day. Still the partitions will be large enough so you can do simple things like: collecting all data for a specific tessel, for a specific date and return all data at once.

_There are books and tutorials about how to select good PartitionKeys and RowKeys, make sure you select them with consideration before you implement your solutions._

#### Create and host the SAS Service

As mentioned before, you need a controlled place where you create and hand out the SAS that will be used for direct access against Azure Table Storage, so we’ll start by creating that service.

There are several choices where you can host services in Microsoft Azure, such as:

* Mobile Services
* Websites
* WebRoles
* Virtual Machines
	* Windows
	* Linux
* App container, such as Dockers
* etc.

In this lab you will build simple REST API with Node.js and host it in Mobile Services. You will be using the portal to setup our Mobile Service manually. There are plenty of deployment alternatives when it comes to Mobile Services, such as:

* Manually through the [Management Portal](http://manage.windowsazure.com)
* Through Azure-CLI (Azure x-Plat Tools) (The lab “[Creating and Calling a Custom REST API with Azure Mobile Services](../mobile-services)” uses this approach)
* Through Git
* Automatically through integration with a build server, like [Visual Studio Online](http://visualstudio.com)


##### Create your Mobile Service

Start by login on to the Microsoft Azure portal at [http://manage.windowsazure.com](http://manage.windowsazure.com) and then press the "New +" button in the bottom left corner and select:

![New-Compute-Mobile Services Screen Shot](images/new-compute-mobileservice-create.png)

Step through the wizard and create your mobile service:

![Create a Mobile Service](images/create-a-mobile-service.png)

* Database: Create a free database, select an existing SQL database or whatever alternative fits best for you. The database is not used att all during this lab at all.
* Region: Make sure you select the region you want to use for hosting your service.
* Backend: Select JavaScript for this lab.
* There is no need to configure advanced push settings

![Specify Database Settings](images/specify-database-settings.png)

_Database settings: Depending on what you selected as alternative for database you will need to provide information on how to contact your database. If you selected to create a new database that would be new login information, while if you selected to connect with an existing database that would be already existing user and password. We will not be using the database during this lab at all, but creation of a Mobile Service still requires us to enter that information._

Wait for your Mobile Service to be created then click on the name to open it for more information.

If you run into trouble look for more information at the official [Microsoft Azure Website](http://azure.com)

##### Create and host a custom REST API in Mobile Services

While having your MobileService open in the browser navigate to the "API tab" of your service and click the "+ CREATE" button at the bottom of the page.

![Create Custom API in Mobile Services](images/create-custom-api.png)

In the next dialog ENTER

* API NAME: weatherconfig
* GET PERMISSION: Everyone
* POST PERMISSION: Only Administrators
* PUT PERMISSION: Only Administrators
* PATCH PERMISSION: Only Administrators
* DELETE PERMISSION: Only Administrators

![Create a new custom API Details](images/create-a-new-custom-api-details.png)

Create the API and wait for it to be available. A custom RESTful API is created where everyone (anonymously) will be able to execute POST Requests against that endpoint. The other verbs will be unavailable for everyone but you as an administrator.

Click on the name of the API you just created to see some sample code that was created for you.

	exports.post = function(request, response) {
	    // Use "request.service" to access features of your mobile service, e.g.:
	    //   var tables = request.service.tables;
	    //   var push = request.service.push;

	    response.send(statusCodes.OK, { message : 'Hello World!' });
	};

	exports.get = function(request, response) {
	    response.send(statusCodes.OK, { message : 'Hello World!' });
	};

Try that sample code by browsing in a new window to the following URL:

	https://[yournamegoeshere].azure-mobile.net/api/weatherconfig

Replace [yournamegoeshere] with the name of your Mobile Service that you just have created and you'll see:

	{"message":"Hello World!"}

Now you have a RESTful API hosted in Mobile Services. Time to replace the code with custom code. In the file [weatherconfig.js](mobile-services/api/weatherconfig.js) you'll find the complete implementation of the code to use.

* Open [weatherconfig.js](mobile-services/api/weatherconfig.js) and copy the contents
* Replace the sample code in your "weatherconfig" API with the provided code
* Save your changes by pushing the "SAVE" button at the bottom.

Test your code:

	https://[yournamegoeshere].azure-mobile.net/api/weatherconfig

... you'll get an "Internal Server Error". Now why is that? Let's find out.

At the top of the custom code you'll see that our Node.js code references a module called 'azure-storage'.

	var azure = require('azure-storage');

That module includes very useful functions for working with Azure Storage that are used in the service, like in the wt.js tool that you ran locally. Unfortunately for us, that Node.js library is not installed on the server where we host our Mobile Service. But we can fix the problem.

![Back Button and Require Statement](images/back-and-require.png)

Use the back button on the management portal web page, NOT THE BROWSERS BACK BUTTON, to get up one step in the hierarchy. Then click on the LOGS section of your Mobile Service.

![Logs](images/logs.png)

You have at least two errors. Select the one on the bottom and click the "DETAILS" button to see more information about that log post.

	Log entry details

	ERROR
	Failed to load script file 'weatherconfig.js': Error: Cannot find module 'azure-storage'
	    [external code]
	    at Object.<anonymous> (D:\home\site\wwwroot\App_Data\config\scripts\api\weatherconfig.js:1:75)
	    [external code]

This confirms, Azure Mobile Services doesn't have the module 'azure-storage' installed, you need to install it.

##### Install your custom Node.js modules in Azure Mobile Services

Both Azure Mobile Services and Azure Web Sites come with a quite well hidden feature called Site Control Manager, SCM or sometimes known by the internal code name, Kudu. You can access your Mobile Services' SCM by browsing to the following url:

	https://[yournamegoeshere].scm.azure-mobile.net

_If you do that from the same browser where you are logged in to the Azure Management portal, you'll be directly logged on so don't be alarmed and think that everyone can access your site's or service's SCM, it's only the ones that are administrator of that Azure Subscription._

![Kudu](images/kudu.png)

Examine the Site Control Manager/Kudu interface and then select "Debug console->PowerShell" from the menu. Through this feature you'll be able to execute commands remotely on your Virtual Machine that hosts your Mobile Service. Neat, right?

	Kudu Remote Execution Console
	Type 'exit' then hit 'enter' to get a new powershell process.
	Type 'cls' to clear the console

	PS D:\home>  

Execute the following commands:

	PS D:\home> cd site\wwwroot\app_data\config\scripts\
	PS D:\home\site\wwwroot\app_data\config\scripts>npm install --save azure-storage

This will install the missing package and save information in the package.json file about it. Once that finished (don't be scared of the red text that might show up on your display) it's time to try and access the service again. Hint: it won't work this time either, but let's do it anyway. Browse to:

	https://[yournamegoeshere].azure-mobile.net/api/weatherconfig

... and once again go back to Azure Management portal and look at the logs for your Mobile Service. You might have to press the "REFRESH" button on the bottom of the page to have the new logs show up. Logs higher in the list are newer logs, so let's look at details for some of them until you find something like this:

	Failed to load script file 'weatherconfig.js': Error: Credentials must be provided when creating a service client.
	    [external code]
	    at Object.<anonymous> (D:\home\site\wwwroot\App_Data\config\scripts\api\weatherconfig.js:2:22)
	    [external code]

There are no errors anymore saying module are missing, so let's find out what this is. On row 2 in the weather API file, you are creating a TableService object that will act as a client for us to execute commands against tables.

	var tableSvc = azure.createTableService();

This is the line that currently fails, because you don't provide any credentials for the storage account and therefore the Azure Storage Module assumes those credentials to be in Environment Variables. Those parameters are really easy to set in the portal.

Go back one step (you know with the back button in the portal, not the browsers back button) and then go to the "CONFIGURE" section for your Mobile Service. Scroll down until you can see the section named "app settings". This is where you can create your Environment Variables, these variables are exactly the same as the once you used earlier in this lab. If you don't remember the key anymore open up your terminal/command window and execute the following Azure CLI command again, where <name> is the name of your storage account that you created before.

	azure storage account keys list <name>

Copy one of the keys (anyone is ok to use) and create the following App Settings:

* AZURE_STORAGE_ACCOUNT
* AZURE_STORAGE_ACCESS_KEY

... and set them to the correct values. When you are done, save your changes with the "SAVE" button at the bottom of the page.

Once again browse to:

	https://[yournamegoeshere].azure-mobile.net/api/weatherconfig

... and if everything now is setup according to plans, you will get another JSON response that tells you:

	{"authorized":false,"message":"deviceId was not provided or has been refused access"}

This is a custom error message and this message means that everything works just fine. In order to get a response back from the server just identify yourselve by appending a deviceId at the end of the URL. Change the URL to the following:

	https://[yournamegoeshere].azure-mobile.net/api/weatherconfig?deviceId=123-123-123

__Be aware__ that this is NOT a fully tested, super secure, authentication implementation. As you can see you can very easily change the deviceId to whatever you want and you'll get a result. There is information on the internet on how you should handle authentication from devices, this is not one of them, but this lab shows you how to use Azure Tables together with a service that gives out Signed Access Signatures (and other configuration) in order to avoid handing over the storage account keys. You've been warned before, but now we've advised you again.

You won't get exactly the same result as shown here but something similar:

	{
		"authorized":true,
		"refreshConfigAfterNo":3,
		"delayBetweenMeasurements":10000,
		"azureStorageAccount":"tesselazure",
		"tableName":"weatherlogs",
		"sas":"se=2014-11-10T03%3A23%3A05Z&sp=a&sv=2014-02-14&tn=weatherlogs&sig=np%2Fv26%2B2lW1JDQ2hxdlhTfNKIDvIcVR0lqH0dvLPv54%3D"
	}

You have your service up and running and it returns information to your client about where the client/device should write weatherlogs, how often the Tessel should look for updated configuration, how long the delay should be between measurements and how the client should authenticate by using a Signed Access Signature, SAS. This approach gives us:

* the flexibility to deny access to specific deviceIds
* reconfigure the devices from the server side
* handle scaling by returning different storage accounts and/or tables for different devices

Take some minutes to try the service and examine the code you've just deployed.

#### Connect your tessel to Azure Table Storage

Now that you have all backend services up and running it's time to connect your Tessel to those services. There is already a finished application in the [tessel folder](tessel), that you can use.

Open a terminal/command window and make sure you have a connection to your Tessel by running:

	> tessel blink

Press Ctrl-C when you have seen enough blinking LEDs. Change directory to the provided [tessel folder](tessel):

	> cd tessel

If you are not currently in the lab directory you have to change directory first. There is a small configuration change you'll need to do in the file. Open the file: weatherdevice.js locally on your computer and find the following rows:

	// REPLACE yournamegoeshere WITH THE NAME OF YOUR AZURE MOBILE SERVICE
	// WARNING: THIS IS NOT NECESSARY THE SAME NAME AS YOUR STORAGE ACCOUNT
	
	var apiUrl = "https://yournamegoeshere.azure-mobile.net/api/weatherconfig";

Replace the part of the URL with the name of your Mobile Service name. Save the file and execute the following command:

	> tessel run weatherdevice.js

Your Tessel will now:

1. Connect to your Mobile Service to retrieve configuration and a Signed Access Signature. Your Tessel will signal this phase with the green LED.
2. With the provided configuration, the Tessel will now use Azure Storage and the configured table. After collecting weather logs (simulated in this lab), the Tessel directly calls Azure Table Storage and adds a row for the current measurement. This phase is signaled by the blue LED.
3. After a delay, the Tessel will do one of two things: Collect more weather logs or ask for new configuration settings. Remember that the Signed Access Signature is valid for a longer time, so the Tessel can write several logs against Azure Tables before a new SAS is needed.

Open a new terminal/console window and change directory to the [tool folder](tool). Remember the tool used to create and insert sample data into the Azure Table. Use that same tool to watch incoming logs from your Tessel by running:

	> node wt read

Be aware: you have to set the Environment Variables: AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY to the name of your storage account and the access key to that storage account respectively again in a new terminal/console window

Expirement with the server side code as well as the Tessel code and make sure you understand the flow.

### Extra Workout

* Use several Tessel devices and have them connect to the same Mobile Service. Update the code on the server side so that each of the connecting Tessel devices gets a different storage account to connect to.
* Implement a solution where you can ban specific Tessel Devices if they get too aggressive with uploading data.
* Implement a service that returns the average temperature per device and day

Summary
-------
You have:

* Created an Azure Storage Account and Table
* Created a service, hosted on Azure Mobile Services, that provides configuration and authentication to the Tessel.
* Create a program on your Tessel that retrieves the configuration from the service and directly connects to Azure Table Storage to write data

By accessing Azure Tables directly we offload very much of the traffic that otherwise would have gone through your own custom API. We’ve also shown that with the correct keys, Azure Table Storage can be an optimal solution to your ever growing storage needs for structured data.

__Go ahead and play around with the solution. Tweak it, extend it, use it in a bigger context. Have fun!__
