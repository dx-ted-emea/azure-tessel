Azure - Tessel Hands on Labs
======================================

_Internet of Things, IoT, what is it? A quick search on Internet will introduce as many questions as answers. So let’s leave the definition to someone else and just get hands-on with IoT by connecting microcontrollers to communicate with each other and the cloud. How to do that and what are the challenges? One thing is certain, you’ll need a microcontroller but how many of them are you going to deploy eventually. Hundreds, thousands or perhaps millions of devices? You certainly would need a scalable backend to handle that unpredictable load._

_Microsoft Azure is a scalable cloud platform for your backend services and Tessel is a competent microcontroller that can be used to simulate the devices you want to deploy._

Here are a set of hands-on labs that help you get up to speed with using Microsoft Azure together with the Tessel microcontroller and accommodate you in acceleration of using these two great technologies/services together. These labs build upon the information you find on the official sites for:

* [Microsoft Azure](http://azure.com) and
* [Tessel](https://tessel.io)

Please make sure you visit the official sites for up to date information and more hands-on labs.

#### [Lab 1 - Setup](labs/_setup) ####
##### Setting up your environment for the labs #####
In this lab you find the steps to help you setup your computer, your Tessel and your Microsoft Azure account. After completing the lab you have a working environment ready for the other labs.

#### [Lab 2 - Azure Mobile Services](labs/mobile-services) ####
##### Creating and Calling a Custom REST API with Azure Mobile Services #####
In this lab you'll create a custom RESTful Node.js Mobile Service in Azure using Azure CLI. Afterwards you will connect to and consume that service from your Tessel microcontroller, resulting in your controller blinking the leds a random number of times.

#### [Lab 3 - Azure Websites](labs/websites) ####
##### Creating and Calling a Custom REST API with Azure WebSites #####
In this lab you'll create a custom RESTful Web Service using Node.js and host it in Azure Web Sites. Afterwards you will connect to and consume that service from your Tessel microcontroller, resulting in your controller blinking the leds a random number of times.

#### [Lab 4 - Service Bus Queues](labs/service-bus-queues) ####
##### Send messages from Tessel to Service Bus Queue #####
In this lab you will put (enqueue) messages in a Queue from your Tessel microcontroller using the REST API. Next you will use app to consume (dequeue) the messages from the queue using the Azure node.js SDK. 


#### [Lab 5 - Azure EventHub](labs/event-hub) ####
##### Using EventHubs for sending telemetry at high scale #####
In this lab you will create an EventHub with the required configuration and security settings using the Microsoft Azure Portal or custom code using Visual Studio. Afterwards you will send telemetry from your Tessel microcontroller to this EventHub.


#### [Lab 6 - Azure Blob Storage](labs/blob-storage) ####
##### Uploading unstructured data to Azure Blob Storage #####
In this lab you will upload unstructured data as files to Azure Blob storage. You implement a simplified weather monitoring device that simulates measures and stores data locally. Based on a trigger the data is uploaded to Azure Blob storage.

#### [Lab 7 - Azure Table Storage](labs/table-storage) ####
##### Uploading structured data to Azure Table Storage #####
In this lab you will first create an Azure Storage Account with a table. Next you create a Mobile Service on Azure that supplies Shared Access Signatures to get permission to access the table from your Tessel. Finally you build a program that runs on your Tessel to simulate a weather monitoring device and stores data in an Azure Table.

#### [Lab 8 - Push Notifications](labs/notification-hub) ####
##### Send Push Notifications to Mobile devices with Notification Hubs #####
In this lab you will learn how to send push notification to a mobile device (Windows Phone or Android) directly from your Tessel. It demonstrates how to use Azure Notification Hub with the Notification Hubs REST API.

#### [Lab 9 - Docker](labs/docker) ####
##### Run the REST API created in the [Azure Websites](labs/websites) lab in a Docker container hosted on an Azure Linux VM #####
In this lab you use an existing Node.js RESTful Web Service and host it in a Docker container running on Linux in Microsoft Azure. Next you will connect to the service from your Tessel microcontroller and consume it. 

---
_The code provided in these hands on labs should only be seen as samples, they have not gone through the rigorous testing needed for production usage. This set of labs are released under "the MIT License (MIT)" and fhe full license can be found [here](LICENSE)_
