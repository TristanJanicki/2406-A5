2406 Assignment 5

Authors:
Nicole Laurin: 101043422
Tristan Janicki: 101080372

Contact:
TristanJanicki@cmail.carleton.ca
nicolejlaurin@cmail.carleton.ca

Program:
Building a node.js application that accesses a public API, and uses the express.js/bootstrap frameworks.


Purpose:
To provide an online storefront for users to purchase office supplies on. working within the code of a realistic Express.js application. The app implements an
online store-front, or garage-sale, website call Yard & Garage where registered users can login
and buy products.

Version:
Node.js version: v10.15.0
OS: Windows version: 10.0.17763


instructions:


Launching instructions: THIS PROJECT IS INTENDED TO BE USED THROUGH THE HEROKU LINK. The redirects will NOT work otherwise so whilst you can launch/host it
on your local machine once you start trying to navigate through the payment process it will stop working.

npm install
node app.js
or
npm start works on heroku (it says it does in the logs) but does not work on my local machine, oddly enough. It always says that the port is in use despite me checking and
killing whatever is using it with netstat -ano | findstr :3000 and taskkill /F /PID (the pid that the netstat returned if any)


To run this app you need a personal Paypal Account
You can create on at paypal.com
When you create the account you don't need to link a credit card or bank account at that
time. I just ignored that step when prompted and it created the account anyway. I received confirmation by email.

1) Changing pay-pal account
Visit app.js file then change client_id and client_secret with your
pay-pal sandbox account.

You can create a sandbox account from below link
https://developer.paypal.com/

3) Setup project
Before starting application please run the populate-for-startup.js
file inside the seed directory to populate the mongodb database.
You can basically run the file with below command (after locating in the terminal)
node populate-for-startup.js

Install the npm module depedencies in package.json by executing:
npm install

4) Run the application
In the application folder execute:
npm start
then you can access from localhost at
http://localhost:3000
or if you are hosting on a remote server like openstack it might be:
https://tristanzon.herokuapp.com/

5) Login to the app using the dummy user for project:
username : admin@admin.com
password : admin
username : tristanjanicki@gmail.com
password : 2406pw1


5) Important
Before starting application please make sure your mongo database runs.

6) Features
Upload local/online photos for products
Add, delete, or update product
Add, delete, or update variant
Add, delete, or update department
Add, delete, or update category
Add, or delete discount code
Sends email on the sign-in
Advance search bar (search for product and categories)
Buy item
Shopping cart
Order history
Distinguishes user and admin
Filters

7) Comments
I tried to add comments almost each of the functions and middleware and tried to explain what they are.
Most important part is here: routes, models, and public>javascripts>custom.js

If you check the code you will see that most of the functions and middleware pretty same.

You can also notice that sometimes used different way to do same thing because the aim is here to show
you another approach to do that.



Testing instructions:
  - access directory of project files
  - enter "node app.js" in the terminal
  - enter one of the following websites into an internet browser:
		"http://localhost:3000/"
	  	"https://tristanzon.herokuapp.com" <-- use this one :D

Issues:

Cart not getting emptied on payment success.
