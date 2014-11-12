Setting up your environment for the labs
========================================
In this lab, we will help you setup your computer, your Tessel and your Microsoft Azure account. After finishing this lab you will have the tools you need installed on your computer, a connection to your Tessel and an active account on Microsoft Azure.

Setup your Microsoft Azure Subscription
---------------------------------------

If you already have an active Microsoft Azure Subscription you can skip ahead to the next section.

Here are the recommended steps in order to setup your Microsoft Azure subscription:

* Browse to http://azure.com and familiarize yourself with the site. All official information about Microsoft can be find from this site, so make sure you bookmark it and return here whenever you need more information about Microsoft Azure.

* Create an account:

  * Watch the instruction [video](http://azure.microsoft.com/en-us/documentation/videos/sign-up-for-microsoft-azure/) (only a few minutes) that shows and explains the process of setting up a subscription. If you have a MSDN Subscription make sure you notice the part about activating your MSDN Benefits, this will give you a lot of included resources, make sure you use it.

  * Now press the green button "Try it now" (text might be different in other languages) on Microsoft Azure Start Page, located at http://azure.com to start the process of signing up for your own subscription.

  * After your subscription is provisioned you can login to the management portal directly using any of these two links:

    * [manage.windowsazure.com](http://manage.windowsazure.com) - Old Portal (still useful)
    * [portal.azure.com](http://portal.azure.com) - New Portal

If everything succeeded succesfully you now have an active Microsoft Azure subscription.

Configure your computer
-----------------------

Now that your Azure Subscription is active, it's time to setup your computer for easy access to Azure and your Tessel device. Microsoft's operating system of choice is Windows, but Microsoft Azure runs several operating systems and most of these labs will work on all the major computer operating systems so make sure you follow the guide that is relevant for your computer.

### Install Node.js

Both the cross platform tools for Microsoft Azure, as well as the Tessel microprocessor uses Node.js as a runtime, so you will start by installing that on your computer. There are many different ways of installing Node.js and it differs somewhat from operating system to operating system. A popular way of installing Node.js is by invoking a packet manager from the terminal/console window. Most of these packet managers and the commands needed to install Node.js are described [here](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager), just follow the intructions. Alternatively navigate to the [official Node.js site](http://nodejs.org/) and download the installer for your operating system.

When you have installed Node.js, open up a terminal/console window and enter the following command in order to verify the setup:

    c:\> node --version
    v0.10.32

If everything works, Node.js should respond with the installed version of Node.js. At the time of writing this was version 0.10.32.

### Install Microsoft Azure Command Line Interface

Most things in Microsoft Azure can be managed through any of the management portals we described above, but sometimes it's quicker or more effective to manage your subscription directly from a console window. Microsoft Azure comes with a cross platform console tool, Azure-CLI, built on top of Node.js, that let's you manage many Azure features through commands. Since we have Node.js installed by now, installing the Azure-CLI is as easy as invoking the Node Packet Manager, NPM with the following command:

	c:\> npm install -g azure-cli

The command will download and install Azure-CLI globally in the system (i.e. not locally in the current folder) and once it's installed you should be able to invoke the following command in order to check the version:

	c:\> azure --version
	0.8.11 (node: 0.10.32)

If you ever need help with Azure-CLI go to the terminal/console window and enter:

	c:\> azure

... and Azure-CLI will respond with a help page the gives you basic information about what is availablefrom there on.

Next we want to connect with your subscription in Microsoft Azure. This is done by associating a certificate with your subscription and the current user on your machine. Fortunately this process is highly automated and can be done by Azure-CLI. Follow these steps to download and import the publishsettings file associated with your account:

	C:\> azure account download

Your default browser will open and you might need to sign in to the portal with your subscription account in order to download the publishsettings file. After login the download will start. Make a note of the location where you save the publishsettings file, you need this in the next step.

	C:\> azure account import <put path to your publishsettings file here>

You have now connected the current user to your Azure Subscription(s). Enter the following command in order to verify that the connection is established correctly.

	C:\> azure account list

Azure-CLI will respond with a list of Azure subscriptions attached to the current user. Done!

### Setup your Tessel

Follow the [official install guidance](http://start.tessel.io/) to setup and connect your computer with your Tessel device. Since you already have installed Node.js, you don't need to do that. Further follow the instructions to install the tools and update your Tessel's Firmware. On Windows and OSX that is often as easy as:

	npm install -g tessel
	tessel update

#### Familiarize yourself with the Tessel

All labs in this series will deploy code to your Tessel. Make sure you take some time to do at least the first official Tessel lab [Blinky](http://start.tessel.io/blinky) in order to test deploying and running a simple program. The section about [usage](http://start.tessel.io/usage) is also really helpful. Execute the following command to get more help:

	tessel --help

#### Setup Wifi on your Tessel

Connecting your Tessel to a network is simple. While your Tessel is connected to your computer, run:

	tessel wifi -n [network name] -p [password]

... where network name is SSID of the network you want to connect to and password is the wpa2 password. The yellow light will blink while connecting and burn constant yellow if connected. The Tessel will remember your network connection the next time you turn it on, so this might be a one time command. Execute the following command to retreive a list of networks to which you are connected:

	tessel wifi -l

### Clone or download content of this GitHub repository (optional but recommended)

The labs provided have a combination of text documentation and sample code. In order to have all documentation and all necessary sample files locally on your computer, we strongly recommend you to clone (using [Git](http://git-scm.com/)) or download all content in this repository locally on your computer.

Summary
-------

You have:

* Node.JS installed on your computer
* An active Microsoft Azure Subscription
* Azure-CLI installed and connected to your Azure Subscription
* Your Tessel connected and updated
