Hands on Labs
=============

All provided labs are about connecting the Tessel micro controller to Microsoft Azure. Hence all labs focus on the collaboration between Tessel and Azure and might not go into details of neither Microsoft Azure nor Tessel. With that said they still provide a simple starting point on how to use both the Tessel device as well as Microsoft Azure. For more in depth details, please look at the official documentation for [Azure](http://azure.com) or [Tessel](https://tessel.io).

[Setup](_setup)
-----------------

In this lab, we will help you get your computer, your Tessel and your Microsoft Azure account all setup. After this lab is done you should have the tools you need installed on your computer, a connection to your Tessel and an active account on Microsoft Azure.

[Creating and Calling a Custom REST API with Azure Mobile Services](mobile-services)
------------------------------------------------------------------------------------

"With Mobile Services, it’s easy to rapidly build engaging cross-platform and native apps for iOS, Android, Windows or Mac, store app data in the cloud or on-premises, authenticate users, send push notifications, as well as add your custom backend logic in C# or Node.js."

During this hands on lab you'll learn how to create your own REST API and host it in Microsoft Azure Mobile Services and communicate with that service from your Tessel microcontroller.

[Creating and Calling a Custom REST API with Azure WebSites](websites)
----------------------------------------------------------------------

"Azure Websites is a fully managed Platform-as-a-Service (PaaS) that enables you to build, deploy and scale enterprise-grade web Apps in seconds. Focus on your application code, and let Azure take care of the infrastructure to scale and securely run it for you."

You'll create a custom REST Ful Web Service using Node.js and host it in Azure WebSites. Afterwards we will connect to and consume that service from your Tessel microcontroller.

[Creating and Calling a Custom REST API hosted on an Azure VM running Dockers](dockers)
----------------------------------------------------------------------------

Microsoft Azure provides an awesome place for you to host many kinds of operating systems and solution. During this lab we will take a custom build Node.js REST Ful Web Service and host it in Docker container running on Linux in Microsoft Azure. When everything is up and running we will connect to and consume that service from your Tessel microcontroller.

[Sending telemetry to Azure using Service Bus Queues](service-bus-queues)
----------------------------------------------------


[Uploading binary data to Azure Blob Storage](blob-storage)
-------------------------------------------


[Uploading structured data to Azure Table Storage](table-storage)
------------------------------------------------
Azure Table Storage is a NoSQL Database hosted in Azure, designed to store massive amounts of structured data and to handle high load. Creating custom APIs using Mobile Services, Azure Websites or Virtual Machines might be the first you think about, but other services can be used independently or in combination with those custom APIs. Having your clients make direct calls to Azure Table Storage will reduce load on your services. Although offloading other services, there are some tradeoffs. Since the clients are writing data directly to Azure Table Storage, you lose some control on the data that gets pushed to your service and you have to implement that in other ways, like using an asynchronous pattern to validate and clean up data. If storing structured data is what you are looking for, then you should definitively consider Azure Table Storage. This lab will show you the basics.

[Sending Push Notifications to mobile devices using Notification Hub](notification-hub)
-------------------------------------------------------------------


[Telemetry Ingest using Azure Event Hub](event-hub)
-----------------------------
Many modern solutions that intend to provide adaptive customer experiences or to improve products through continuous feedback and automated telemetry are faced with the challenge of how to securely and reliably ingest very large amounts of information from many concurrent publishers. Microsoft Azure EventHubs is a managed platform service that provides a foundation for large-scale data ingestion in a broad variety of scenarios.

You'll create an Azure EventHub using the Azure Portal or C# code. Afterwards we will ingest telemetry data from your Tessel microcontroller to the EventHub 

[Communicating with a Node.js MQTT Server hosted on Azure](worker-roles)
--------------------------------------------------------
