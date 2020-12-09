# Pay It Forward
[![Build Status](https://travis-ci.com/remote-software-fa20-PayItForward/PayItForward.svg?branch=main)](https://travis-ci.com/remote-software-fa20-PayItForward/PayItForward)

Pay It Forward web application that enables users to donate money directly to another user, as well as receive money from other users, using change from the transactions on their banks statements. 
Users can list specific items they lack funds for (e.g. groceries, gas, books) and other users can choose to contribute to a specific item.

## To build and test locally

You must have node.js and npm installed. Clone the repository. Insert the list of secret keys into a file called .env in the backend folder. Then type the following commands:
```
cd backend
npm install
npm start
cd ./frontend
npm install
npm start
```
Your web browser should open to the homepage. If your browser does not open, navigate to http://localhost:3000/
