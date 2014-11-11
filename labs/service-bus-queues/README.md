Send messages from Tessel to Service Bus Queue
=============
Asynchronous messaging patterns are the architectural cornerstone of reliable and scalable applications. Integrating cloud resources with Service Bus messaging ensures smooth operation under heavy and variable load with the durability to survive intermittent failures.
In this lab you will learn how to use Service Bus Queue by creating a Tessel app that put (enqueue) messages in a Queue using the REST API, later a consumer app will get (dequeue) the message from the queue using the Azure node.js SDK.
Generally you can read the following article about what is Service Bus Queue and how to use it with node.js [ How to Use Service Bus Queues ](http://azure.microsoft.com/en-us/documentation/articles/service-bus-nodejs-how-to-use-queues/)

Prerequisites
-------------
In order to successfully complete this lab you need to:

* Have successfully setup your Azure Subscription, your development environment and your Tessel according to instructions outlined in the [Setup Lab](../_setup).
* You have a tessel ambient module and its configured acording to: <a href="http://start.tessel.io/modules/ambient">Tessel ambient module</a> 


Instructions
------------
(Describe the lab here. Divide the lab into logical parts in order for the participant to easily follow along. If possible, describe the steps in the lab using steps that are platform agnostic, i.e. it should work using whatever operating system you want. If possible use Azure-CLI to manage Windows Azure, but also explain how to use the portal if you feel it adds extra value or visibility. Remember that the portal(s) are changing faster than Azure-CLI, so the labs will be easier to maintain if we use Azure-CLI and since the Tessel's programming tools are used from the console, we might as well stick with it as much as possible. The preferred programming language on the server and client side should be JavaScript if possible in order to keep complexity of setup to a minimum.)

### Part 1 - Create Service Bus Namespace and Queue, get the authentication credentials
#### Part 1.1 - Create Service Bus Namespace and Queue
The very first thing you will have to do when working with Service Bus is to create a namespace.





### Part 2
(Text in part two goes here)

* (Bullet one)
* (Bullet two)
  * (Bullet two point one)
  * (Bullet two point two)

#### Part 2.1
(Text in part two point one goes here)

#### Part 2.2
(Text in part two point two goes here)

#### Part 3
(Text in part three goes here)

	// Use comments in code only if code is otherwise confusing.
	// We want the code to be as good and clean written that it
	// is self-explanatory and doesn't need comments. Still don't
	// be afraid to use comments if needed.

	code.indent(tab); // Indent code with 4 spaces (or tab) to have it appear as code

Summary
-------
(Include a short summary that explains what has been done during the lab. Use a couple of sentences, bullets and other, but don't explain the full lab once again)

(OTHER - REMOVE THIS SECTION)
-----------------------------
(Put whatever code files is needed for the lab directly in the lab's folder or if necessary in sub folders. Also update the main README.md file located in the "labs-folder" and link to this new lab. Make sure to spell check the lab using English US settings.)
