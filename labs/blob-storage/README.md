Uploading unstructured data to Azure Blob Storage
=================================================
Taken from the official Azure Website:

"Azure Blob storage is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. You can use Blob storage to expose data publicly to the world, or to store application data privately."

During this lab we will upload unstructured data in form of files to Azure Blob storage. The content of these files could be anything from pictures, custom format binary data or plain text. We will implement a simplified weather monitoring device that will measure and store data locally and when triggered upload the data to Azure Blob storage. 

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Required: Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* Recommended: The lab [Uploading structured data to Azure Table Storage](../table-storage) will take another approach on the same scenario but will instead use Azure Table storage to save data. That lab will also show how to implement the required service to handle simple authentication against the Azure Storage service.

Instructions
------------

### Setting up Azure

Before we can send data to Azure we need to make sure we have a storage account and a container in that storage account.

#### Create a storage account

During this part of the lab you use the Azure-CLI (Azure x-Plat Tools), even though you can easily do the same thing using the management portal if you want to.

Open a terminal/console window. Execute the following commands to get insight into what you will do next.

	azure storage account --help
	azure storage account create --help

When you are ready, execute the following command to create a new storage account. Replace <name> with a globally unique name that you want to use. The command will fail if the name is already taken, so chose something unique, be creative. You can also change the location of the datacenter you want to use. _The recommendation is to put your storage account in the same datacenter as your other services in order to reduce lag and expenses related to data transfers between datacenters. Chose whatever location you feel appropriate.

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

#### Create a container

Using Azure-CLI execute the following command to create a container named 'weatherlogs' in your newly created storage account:

	> azure storage container create weatherlogs

By default, no one can't access that container unless they have the Storage Account and the Storage Access Key. Since you have that information in the environment variables we do have access right now and can therefor execute the following command to list blobs inside that container.

	> azure storage blob list weatherlogs

Since the container is just created you'll find no blobs in it. But we do have access. In order for the Tessel to gain access, we need to provide the device with some method of authentication, but we don't want to give away the Storage Account and Storage Access Key to it. How do we do then?

Azure has a mechanism called Signed Access Signature, SAS, that let you give away temporary permissions to clients (and devices) with a specific purpose. During this lab we will generate that SAS manually using Azure-CLI. In a real life scenario you would want your Tessel to reach out to a service, authenticate and retrieve a SAS. After that the Tessel could connect directly with Azure Storage. For a longer example of how this could be achieved have a look at the lab [Uploading structured data to Azure Table Storage](../table-storage) that implement such a service.

Execute the following command to create a SAS that will provide write (w) access to the container weatherlogs. The date is ISO formatted date and replace that date with a date of your own that sets the expiry date for the SAS:

	> azure storage container sas create weatherlogs w 2014-11-10T21:00:00

	info:    Executing command storage container sas create
	+ Creating shared access signature for container weatherlogs
	data:    Shared Access Signature se=2014-11-10T21%3A00%3A00Z&sp=w&sv=2014-02-14&sr=c&sig=i0Wbt%2Fc8dd%2FNr61qlzZCQ%2FNa4%2ByI0U4Dy1%2BGCF%2B8KkM%3D
	info:    storage container sas create command OK

Save the Shared Access Signature since we will be using it soon.

### Connecting our Tessel to Blob Storage

In the [tessel folder](tessel) you'll find a sample Weather Device implementation. By default the sample collects (fake)weather information every second and saves it in a variable as a semicolon separated string. Whenever someone presses the config button (that's the button close to the orange WiFi LED) on the Tessel, the upload process will start.

Edit weatherdevice.js by finding the following code and replacing the information with your SAS and Storage Account Name.

	// TODO: REPLACE US!!!!!!!!
	var sas = 'se=2014-11-11T00%3A00%3A00Z&sp=w&sv=2014-02-14&sr=c&sig=RqZeSVZ5GMs%2B1gCilSkFqK8FnLGKuSQWwPvcumLDYEg%3D'; 
	var	accountName = 'tesselazure';

Take some time to browse through the implementation to see how blobs are uploaded to Azure Storage. During this sample we haven’t used any toolkits/SDKs that are available for integration with Microsoft Azure. Instead we've crafted a manual HTTPS Request against the REST API that exposes Azure Storage. All functionality in Microsoft Azure is exposed using RESTful APIs which might come handy when dealing with Azure from devices with limited functionality or programming languages with limited SDKs. Almost any language or device that can issue HTTP/HTTPS Requests can interact with Microsoft Azure.

Go back to the terminal/console window and make sure you are in the [tessel folder](tessel). Execute the following command in order to start the sample.

	> tessel run weatherdevice.js

Wait for it to start and when you see (fake) measurements start showing up on the console, you are ready to press the config-button. Press the config-button!

A new unique blob name will be generated and the process to upload all retrieved weather information starts. After a while you'll get a response code.

* HTTP 201 = Created - Indicates that your blob was successfully created.
* HTTP 403 = Forbidden - Means that you don't have access to execute the request you were trying to execute. Most of the time this is due to the fact that the SAS had expired.

Press the button a couple of times to upload some logs.

Execute the following command to list the blobs in your container:

	> azure storage blob list weatherlogs

Select some of them and download those blobs using the command

	> azure storage blob download weatherlogs <blobname> c:\tmp

The format of the data and the blobs we've just uploaded to Azure would probably be an exelent candidate to examine more with technologies like Hadoop or similar. Microsoft Azure provides a 100% Appache Hadoop-based service called, [HDInsight](http://azure.microsoft.com/en-us/services/hdinsight/).
 
Explore the different options you have of interacting with Blob Storage using Azure-CLI.

Summary
-------
During this lab you've explored the possibility to upload unstructured data like text, images and other binary formats directly to Azure Blob storage. This lab only explored the ability to upload data, but Azure Blob storage can also be used for reading and other operations so keep it in mind whenever you are working with unstructured data.
