Azure - Tessel Hands on Labs
======================================

A set of hands on labs that will help you get up to speed with using Microsoft Azure together with your Tessel micro controller.

[These labs](labs) build up on the information you’ll find on the official sites for:

* [Microsoft Azure](http://azure.com) and
* [Tessel](https://tessel.io)

... and are here to accommodate you in acceleration of using these two great technologies/services together. Please make sure you visit the official sites for up to date information and more hands-on labs.

#### [Lab 1 - Setup](labs/_setup) ####
In this lab you find the steps to help you setup your computer, your Tessel and your Microsoft Azure account. After completing the lab you have a working environment ready for the other labs.

#### [Lab 2 - Azure Mobile Services](labs/mobile-services) ####
In this lab you'll create a custom RESTful Node.js Mobile Service in Azure using Azure CLI. Afterwards you will connect to and consume that service from your Tessel microcontroller, resulting in your controller blinking the leds a random number of times.

#### [Lab 3 - Azure Websites](labs/websites) ####
In this lab you'll create a custom RESTful Web Service using Node.js and host it in Azure WebSites. Afterwards you will connect to and consume that service from your Tessel microcontroller, resulting in your controller blinking the leds a random number of times.

#### [Lab 4 - Azure Table Storage](labs/table-storage) ####
In this lab you'll first create an Azure Storage Account with a table. Next you create a Mobile Service on Azure that supplies Shared Access Signatures to get permission to access the table from your Tessel. Finally you build a program that runs on your Tessel to simulate a weather monitoring device and stores data in an Azure Table.

#### [Lab 5 - Azure EventHub](labs/event-hub) ####
In this lab you create an Event Hub in Azure Service bus using the Azure portal or C# code. Next you build a program that runs on your Tessel and sends telemetry data to EventHub.

#### [Lab 6 - Push Notifications](labs/notification-hub) ####
In this lab you create a Notification Hub in Azure Service bus and a mobile App that registers for notifications. Next you build a program that uses the Tessel __Ambient module__ to trigger sending notifications to Notification Hub

#### [Lab 7 - Dockers](labs/dockers) ####
##### Creating and Calling a Custom REST API hosted on an Azure VM running Dockers #####

Microsoft Azure provides an awesome place for you to host many kinds of operating systems and solution. During this lab we will take a custom build Node.js REST Ful Web Service and host it in Docker container running on Linux in Microsoft Azure. When everything is up and running we will connect to and consume that service from your Tessel microcontroller.


---
_The code provided in these hands on labs should only be seen as samples, they have not gone through the rigorous testing needed for production usage. **Code is provided as is and without any warranties.** You are free to use it and please help fix any bugs you find._
