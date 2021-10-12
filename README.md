# Capstone Serverless Project

This is a simple Library book issue application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating books data. Each Book can optionally have an image. Each user only has access to the Book that he/she has issued.

# Books data

The application stores Books data, where each book contains the following fields:

- `bookId` (string) - a unique id for each book
- `createdAt` (string) - date and time when book was created in list
- `name` (string) - name of a book
- `issueDate` (string) - date on which book was issued
- `dueDate` (string) - date by when book should be returned 
- `bookStatus` (boolean) - true if book has been returned, false otherwise
- `attachmentUrl` (string) (optional) - a URL pointing to an image attached to book
- `userId` (string) - id of a user who has issued book.

# Functions implemented

The `serverless.yml` file has the following functions:

- `Auth` - a custom authorizer for API Gateway that is added to all other functions.

- `GetBooks` - returns all Books for a current user. A user id can be extracted from a JWT token that is sent by the frontend.

- `issueBook` - creates book for a current user. The schema of data sent by a client application to this function can be found in the `CreateBookRequest.ts` file. It receives new book to be created in JSON format.

- `UpdateBook` - updates a book issued by a current user. The schema of data sent by a client application to this function can be found in the `UpdateBookRequest.ts` file. It receives an object that contains four fields that can be updated in a book item. The id of an item that should be updated is passed as a URL parameter.

- `DeleteBook` - deletes a book issued by a current user. Also deletes any attached image from the S3 bucket.

- `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for book item. An id of a user can be extracted from a JWT token passed by a client. Also deletes any previously attached image from the S3 bucket.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project. The only file that you need to edit is the `config.ts` file in the `client` folder.

## Authentication

This application implements authentication via an Auth0 application. The "domain" and "client id" is copied to the `config.ts` file in the `client` folder. This project uses asymmetrically encrypted JWT tokens.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

# Postman collection

There is a provided Postman collection that contains sample requests in this project.
