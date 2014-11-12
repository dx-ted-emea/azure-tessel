Azure - Tessel Hands on Labs
======================================

There is a lot of buzz around Internet of Things, IoT, nowadays. But what is it? A quick search on Internet will introduce as many questions as you will find answers. So let’s leave the definition to someone else and just get hands-on with IoT by connecting some microcontrollers to communicate with each other and the cloud. How do we do that and what kind of challenges might we encounter? One thing is certain, you’ll need a microcontroller but we might not know how many of them we’re going to deploy eventually. Hundreds, thousands or perhaps millions of devices? We certainly would need a scalable backend to handle that unpredictable load in order to keep up with the demand of backend resources.

Microsoft Azure is a scalable cloud platform for you to build such a solutions on and Tessel is a competent microcontroller that could be used to implement the devices you want to deploy. Here you’ll find a set of hands on labs that will help you get up to speed with using Microsoft Azure together with the Tessel micro controller. These labs build upon the information you’ll find on the official sites for:

* [Microsoft Azure](http://azure.com) and
* [Tessel](https://tessel.io)

... and are here to accommodate you in acceleration of using these two great technologies/services together. Please make sure you visit the official sites for up to date information and more hands-on labs.

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
##### Sending telemetry to Azure using Service Bus Queues #####
Asynchronous messaging patterns are the architectural cornerstone of reliable and scalable applications. Integrating cloud resources with Service Bus messaging ensures smooth operation under heavy and variable load with the durability to survive intermittent failures. In this lab you will learn how to use Service Bus Queue by creating a Tessel app that put (enqueue) messages in a Queue using the REST API, later a consumer app will get (dequeue) the message from the queue using the Azure node.js SDK.

#### [Lab 5 - Azure EventHub](labs/event-hub) ####
##### Using EventHubs for sending telemetry at high scale #####
Many modern solutions that intend to provide adaptive customer experiences or to improve products through continuous feedback and automated telemetry are faced with the challenge of how to securely and reliably ingest very large amounts of information from many concurrent publishers. Microsoft Azure EventHubs is a managed platform service that provides a foundation for large-scale data ingestion in a broad variety of scenarios.

#### [Lab 6 - Azure Blob Storage](labs/blob-storage) ####
##### Uploading unstructured data to Azure Blob Storage #####
During this lab we will upload unstructured data in form of files to Azure Blob storage. The content of these files could be anything from pictures, custom format binary data or plain text. We will implement a simplified weather monitoring device that will measure and store data locally and when triggered upload the data to Azure Blob storage.

#### [Lab 7 - Azure Table Storage](labs/table-storage) ####
##### Uploading structured data to Azure Table Storage #####
In this lab you'll first create an Azure Storage Account with a table. Next you create a Mobile Service on Azure that supplies Shared Access Signatures to get permission to access the table from your Tessel. Finally you build a program that runs on your Tessel to simulate a weather monitoring device and stores data in an Azure Table.

#### [Lab 8 - Push Notifications](labs/notification-hub) ####
##### Send Push Notifications to Mobile devices with Notification Hubs #####
In this lab you will learn how to send push notification to a mobile device (Windows Phone or Android) directly from your Tessel. It demonstrates how to use Azure Notification Hub with the Notification Hubs REST API.

#### [Lab 9 - Docker](labs/docker) ####
##### Running the REST API created in the [Azure Websites](labs/websites) lab in a Docker container hosted on an Azure Linux VM #####
Microsoft Azure provides an awesome place for you to host many kinds of operating systems and solution. During this lab we will take an existing Node.js RESTful Web Service and host it in a Docker container running on Linux in Microsoft Azure. When everything is up and running we will connect to and consume that service from your Tessel microcontroller.

---
_The code provided in these hands on labs should only be seen as samples, they have not gone through the rigorous testing needed for production usage. This set of labs are released under "the MIT License (MIT)" and fhe full license can be found [here](LICENSE)_
