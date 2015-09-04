
# Colftime

A simple Node.js (Express) + MongoDB app to track colf enter/exit time.
A configurable PIN is required to access the app.

## A note about security

Securing the app via a PIN is only a simple way to avoid my colf to clock IN/OUT while she is not at my home and it is fair for this use case. Please *DO NOT* use a similar approach to prevent hackers entering your application. 


## How to run it 

Simply clone the repo, setup the ENV vars (see below) and run a 

	npm start

## ENV vars

The app refers to the following ENV vars to setup DB access and to verify the PIN:

	COLFTIME_DB_USER=user
	COLFTIME_DB_PASSWORD=password
	COLFTIME_DB_SERVER=server
	COLFTIME_PIN=supersecret		# PIN needed to access the APP
	DEBUG=colftime:server 			# enable debug log

ENV vars are automatically loaded from ```.env``` file if it is present in the app root folder 



