# Welcome to "Exercise"

![Example Screenshot](https://raw.githubusercontent.com/KnoxArg/exercise/master/client/example_images/screenshot.png)
Exercise is a sortable list of items composed by an image and a description that allows you to

 1. Add 
 2. Edit 
 3. Delete
 4. Sort
 5. Track the amount of items in the list

State is automatically stored with each action.

*Note: Only images with dimension up to 320x320 and descriptions with a maximum of 300 characters are allowed*

## Technical information

Exercise runs on docker using two containers

 - App: Runs on Node and uses Jquery UI + Vanilla JS
 - Db: Runs on MongoDB using default port. Data will be stored outside the container by using volumes

App container will wait for DB to be up.

# Installation

 1. Clone repo
 2. Execute "docker-compose up"

 
