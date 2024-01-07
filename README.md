# File Management API

This is a simple file management API built with Node.js. It allows users to upload, list, and delete files. It also implements file categorization functionality.

## Features

- User authentication using JWT (JSON Web Tokens).
- File upload, listing, and deletion.
- File categorization.
- File versioning.
- Server-side storage for user's file data.
- Data encryption for sensitive information.
- Auto Deletion of file on error

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installing

1. Clone the repository:
   `git clone https://github.com/saurabhrkp/file-management-api.git`

2. Install the dependencies:

   `cd file-management-api`
   `npm install`

## Running the Application

- For development:

  `npm run start:dev`

- For production:

  `npm run start`

## Built With

- Node.js
- Express.js
- Multer
- Prisma
- SQLite

## Postman Workspace

Open [here](https://www.postman.com/red-eclipse-518728/workspace/file-management-api) to access postman workspace & collection for project

Test Users Collections:
Steps:

1. Sign up: Create new account. Username, Email & password all are required fields
2. Sign in: Sign in using created account. Username & password are required fields.
3. Refresh Token: As access token are only valid for one day, get new access token using refresh token which have 15 day validity.

To Test Files Collection:
Step:

1. First Create new account or sign in with exisiting account using Users Collection.
2. Sign in request have test script attached to it, as soon request is passed with access tokens test script set access token & refresh token in environment variables.
3. As all files routes are protected routes, all request made should have access token attached to it for authentication.
4. Files Collection have Pre-request script attached to it, which get access token & refresh token form environment variables and pass them in every request headers.

## Authors

- Saurabh Patel

## License

This project is licensed under the ISC License.
