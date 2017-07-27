[![Code Climate](https://codeclimate.com/github/andela-ookoro/DocumentMGT.svg)](https://codeclimate.com/github/andela-ookoro/DocumentMGT) [![Build Status](https://travis-ci.org/andela-ookoro/DocumentMGT.svg)](https://travis-ci.org/andela-ookoro/DocumentMGT)
[![Coverage Status](https://coveralls.io/repos/github/andela-ookoro/DocumentMGT/badge.svg?branch=production)](https://coveralls.io/github/andela-ookoro/DocumentMGT?branch=staging)

# Document Hub

## Introduction
### **`Document Hub`** is a full stack project that serves an api and a single page web application built with [React](https://facebook.github.io/react/) framework that manages documents.
### It has the following features;
  * User authentication
  * User can view documents
  * User can view documents based on access right and title
  * User can delete a document
  * User can view a limited number of documents
  * User can download documents
  * User can update profile
  * User can update documents
  * An admin User can block and restore regular users
  * An user can delete her account
*  Click [here](http://dochome.herokuapp.com/) to access the app on Heroku

## Tech Stack
Document Hub uses [React](https://facebook.github.io/react/) and [Materialize css](http://materializecss.com/) on front-end, it uses [postgres](https://www.postgresql.org/) as back-end api database  and it is served with Node.js/Express.js.

## Installation and setup
*  Navigate to a directory of choice on `terminal`.
*  Clone this repository on that directory using SSH or HTTP.
  *  Using SSH;

    >git clone git@github.com:andela_ookoro/DocumentMGT.git

  *  Using HTTP;

    >https://github.com/andela_ookoro/DocumentMGT.git


* Install the app's backend dependencies.Open node.js, navigate to the directory that contains the application code base,then enter the command below:
   >npm install
   #### Create a .env file in the root folder with the variables in the .env.example file; ensure that your change the values to real values.The variable includes JWT secret token and database remote URl.
* To start the application enter the command below in the terminal:
   >npm run dev
* If the command run successfully, node.js would display the text below.

  ```
  ----------------------------------------------------------------------
  Dochub running at  http://localhost:1142

  ```
* Open the  **[link](http://localhost:1142)** on a browser to view the application.
  [Google chrome ](https://www.google.com/chrome/) is recommended 

## Code Structure
* React files are stored in `client` folders
* API server files are stored in `server` folder
* Test scripts are stored in the `(client|server)/__tests__` folder

## Contribution
 ### To contribute to this project, follow the steps below:
  * Clone the repository as described in the section 'Installation and setup' above
  * Create a branch using the format, branch name => `Feature_<few words about your contribution>` 
  * Add your contributions to your branch
  * Push to your branch
  * Create a pull Request from your branch
  * We would review it and get back to you. (Ensure your attach a contact to your PR comment)
  * For more information send an email to  [Developing team](okwudiri.okoro@andela.com)

## limitation
  * The project does not support third party authentication 
  * The project does not support file upload
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## FAQ
* How can I view the API documentation.
  > You can access the API documentation [here](http://dochome.herokuapp.com/apiDoc)
* Can I change the author of the document
  > No, You can't change an author of a document. You can update your profile, the document would have the new author name.
* When an admin blocks a user, what happens to her documents
  > Nice, the documents are not deleted and the document retains it's properties.
* When an admin restore a user account, would the user gain access to her existing documents.
  > Yes, the user regains existing priviledges and access to her existing documents.
* What is the password policy of the application
  > A password should have at least six character, a number and a special symbol.
* Does the API report use of disallowed words
  > No, you can include that feature in your client project
* What is the maximum length of the document body or content.
  > The api support any character and the maximum length is 5000 character. You can clone and edit this setting in your model.
