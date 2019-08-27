# INSTA.id presents D.E.V.s.
## Digital Employment Verification system 
## Description
InstaId.xyz is a digital identification app that allows your clients/customers verify your employees while they are in the field.   The application's interface is split into two the employee web-app and the administrator dashboard.  
From the Administrator's Dashboard admins can manage employees (basic CRUD functions) and update their current employment status.   
[dashboard gif here]
From the responsive web-application employees can login and generate an exclusive QR Code based for your client/customer to scan.  
[employee app gif]
 

## How to deploy Insta.id
Step 1: Clone repo 
[screenshot]
Step 2: From the directory you just cloned, install dependencies: 
npm install 
Step 3:  Create a ".evn" file:
File defaults are the following: 
DB_HOST=localhost
DB_PORT=5432
DB_NAME=identifydb
Step 4: Install postgres if not already installed
https://www.postgresql.org/download/
Step 4a: To build the required tables: 
npm run db:reset
Step 5: Browse to localhost:3000 (this is a default setting). 
[screenshot]
    

## Technologies Utilized
* Node.js
* Node.js primary dependencies: 
  * Qrcode: https://www.npmjs.com/package/qrcode
  * Base64-img-promise:  https://www.npmjs.com/package/base64-img-promise
  * Sweet Alert 2:  
  * Pg-promise: 
 Postgres Database 
* Express.js
  * Templating with EJS
* JavaScript
  * jQuery
* CSS
  * Bootstrap 
* HTML 
## Contributors 
* Eugene Kim: https://github.com/ekim1707 
* Tracy Nguyen: https://github.com/nguyentracy
* Jonathan Alicea: https://github.com/jfalicea 

_Special Thank Yous to the DigitalCrafts Team:_ 

* Rob Bunch: https://github.com/rbunch-dc
* Jonathan Ray:  https://github.com/ray-jonathan
* Tony DiRusso:  https://github.com/A-DiRusso
* Chris Aquino:  https://github.com/radishmouse
