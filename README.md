Telegram Bot Admin APIs Documentation
This repository contains APIs for administering the Telegram bot users.

Endpoints
1. GET /users
Description: Retrieve a list of all users.

Request:

Method: GET
Endpoint: /users
Response:

Status: 200 OK
Body: JSON array containing user objects.
2. PUT /users/:id
Description: Update user data by ID.

Request:

Method: PUT
Endpoint: /users/:id
Params: id (User ID)
Body: JSON object containing fields to update (messageFrequency, blocked)
Response:

Status: 200 OK
Body: JSON object with success message.
3. DELETE /users/:id
Description: Delete user by ID.

Request:

Method: DELETE
Endpoint: /users/:id
Params: id (User ID)
Response:

Status: 200 OK
Body: JSON object with success message if user is found and deleted. Otherwise, "User Not Found" message.

Technologies Used
Node.js
Express.js
MongoDB
Mongoose
