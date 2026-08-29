# News Aggregator API

A RESTful News Aggregator API built with **Node.js, Express.js, MongoDB, Mongoose, bcrypt, JWT, and Axios**.

The application allows users to:

* Register and securely store their password using bcrypt
* Log in and receive a JWT authentication token
* Store and manage personalized news preferences
* Fetch news based on their saved preferences
* Access protected routes using JWT authentication
* Validate incoming request data
* Handle authentication, database, and external API errors

---

## Tech Stack

* **Node.js** — Runtime
* **Express.js** — REST API framework
* **MongoDB** — Database
* **Mongoose** — MongoDB ODM
* **bcrypt** — Password hashing
* **jsonwebtoken** — JWT authentication
* **Axios** — External News API requests
* **dotenv** — Environment variable management
* **Tap** — Testing framework
* **Supertest** — HTTP API testing

---

## Project Structure

```text
news-aggregator-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── users.controller.js
│   └── news.controller.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   └── user.model.js
│
├── routes/
│   ├── users.route.js
│   └── news.route.js
│
├── test/
│   └── server.test.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

### Application Architecture

The application separates the Express application from the server startup:

```text
app.js
  │
  ├── Express configuration
  ├── Middleware
  └── Routes
       │
       ▼
    Export app


server.js
  │
  ├── Connect to MongoDB
  └── Start HTTP server
```

This also allows the application to be imported by Supertest without starting another HTTP server.

---

# Prerequisites

Before running the project, make sure you have:

* Node.js 18 or higher
* npm
* MongoDB or MongoDB Atlas
* A NewsData.io API key

---

# Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd news-aggregator-api-sairamgatla07
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
NEWS_API_KEY=your_newsdata_api_key
```

### Environment variables

| Variable         | Purpose                             |
| ---------------- | ----------------------------------- |
| `PORT`           | Port used by the Express server     |
| `MONGO_URI`      | MongoDB connection string           |
| `JWT_SECRET_KEY` | Secret used to sign and verify JWTs |
| `NEWS_API_KEY`   | API key used to access NewsData.io  |

**Do not commit `.env` to GitHub.**

A `.env.example` file can be used to document the required variables without exposing credentials.

---

# Running the Application

Start the server:

```bash
node server.js
```

Or, if the `package.json` contains a start script:

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

The root endpoint can be used to verify that the service is running.

```http
GET /
```

Example response:

```json
"news aggregator service running"
```

---

# API Endpoints

## 1. Register User

### Endpoint

```http
POST /users/signup
```

### Request Body

```json
{
  "name": "Clark Kent",
  "email": "clark@superman.com",
  "password": "Krypt()n8",
  "preferences": [
    "movies",
    "comics"
  ]
}
```

### Validation

The registration endpoint validates:

* `name` must be a string
* `email` must be a string
* `password` must be a string
* `preferences` must be an array
* Required fields must not be empty
* Email must have a valid format
* Password must contain at least 8 characters
* Email must not already belong to another user

### Password Security

Passwords are hashed using bcrypt before being stored in MongoDB.

The plain-text password is never stored in the database.

### Successful Response

```http
200 OK
```

```json
{
  "message": "successfully registered a user"
}
```

---

# 2. Login

### Endpoint

```http
POST /users/login
```

### Request Body

```json
{
  "email": "clark@superman.com",
  "password": "Krypt()n8"
}
```

### Authentication Process

The API:

1. Finds the user using their email.
2. Compares the supplied password with the bcrypt hash.
3. Creates a JWT after successful authentication.
4. Returns the JWT to the client.

### Successful Response

```http
200 OK
```

```json
{
  "message": "login sucessful",
  "token": "<JWT_TOKEN>"
}
```

### Invalid Credentials

```http
401 Unauthorized
```

---

# JWT Authentication

Protected endpoints require the JWT returned from the login endpoint.

Send the token using:

```http
Authorization: Bearer <JWT_TOKEN>
```

For example:

```http
GET /users/preferences
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The authentication middleware:

1. Reads the `Authorization` header.
2. Checks for the `Bearer` scheme.
3. Extracts the token.
4. Verifies the token using `JWT_SECRET_KEY`.
5. Stores the decoded user information in `req.user`.
6. Allows the request to continue.

Requests with a missing or invalid token return:

```http
401 Unauthorized
```

---

# 3. Get User Preferences

### Endpoint

```http
GET /users/preferences
```

### Authentication

Required.

```http
Authorization: Bearer <JWT_TOKEN>
```

### Example Response

```json
{
  "message": "Sucessfully fetched",
  "preferences": [
    "movies",
    "comics"
  ]
}
```

The preferences are retrieved from the authenticated user's MongoDB document.

---

# 4. Update User Preferences

### Endpoint

```http
PUT /users/preferences
```

### Authentication

Required.

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "preferences": [
    "movies",
    "comics",
    "games"
  ]
}
```

The API validates that `preferences` is an array.

### Example Response

```json
{
  "message": "Preferences updated successfully",
  "preferences": [
    "movies",
    "comics",
    "games"
  ]
}
```

The updated preferences are persisted in MongoDB.

---

# 5. Fetch Personalized News

### Endpoint

```http
GET /news
```

### Authentication

Required.

```http
Authorization: Bearer <JWT_TOKEN>
```

### How It Works

The request follows this flow:

```text
GET /news
    │
    ▼
JWT Authentication
    │
    ▼
Get authenticated user ID
    │
    ▼
Find user in MongoDB
    │
    ▼
Read user's preferences
    │
    ▼
Build NewsData.io query
    │
    ▼
Axios request to external News API
    │
    ▼
Return news articles
```

The user's preferences are joined into a query and sent to NewsData.io.

For example:

```text
movies OR comics OR games
```

### Example Response

```json
{
  "message": "sucessfully fetched news",
  "news": [
    {
      "...": "..."
    }
  ]
}
```

The exact article fields depend on the response returned by NewsData.io.

### Missing Preferences

If the authenticated user has no preferences:

```http
400 Bad Request
```

```json
{
  "message": "Please set your news preferences first"
}
```

### External News API Failure

If the external News API request fails, the API returns an error response rather than exposing the external service error directly.

---

# Error Handling

The application handles common API failures including:

* Missing request fields
* Incorrect input data types
* Invalid email format
* Invalid password length
* Invalid preferences
* Duplicate email addresses
* Missing authentication token
* Invalid JWT
* User not found
* Database errors
* External news API errors

The main HTTP status codes used are:

| Status Code | Usage                       |
| ----------- | --------------------------- |
| `200`       | Successful request          |
| `400`       | Invalid input / bad request |
| `401`       | Authentication failure      |
| `404`       | User/resource not found     |
| `500`       | Internal server error       |
| `502`       | External API failure        |

---

# Database Model

The application uses a MongoDB `User` collection.

A user contains:

```text
User
├── name
├── email
├── password
└── preferences[]
```

Example:

```json
{
  "name": "Clark Kent",
  "email": "clark@superman.com",
  "password": "<bcrypt-hash>",
  "preferences": [
    "movies",
    "comics"
  ]
}
```

Passwords stored in MongoDB are bcrypt hashes rather than plain-text passwords.

---

# Testing

The project uses:

* **Tap** for the test framework
* **Supertest** for making HTTP requests against the Express application

Run the tests using:

```bash
npm test
```

The test suite covers:

```text
POST /users/signup
POST /users/signup with missing email
POST /users/login
POST /users/login with wrong password

GET /users/preferences
GET /users/preferences without token

PUT /users/preferences
GET /users/preferences after update

GET /news
GET /news without token
```

The tests verify both successful API behavior and authentication/validation failures.

---

# Testing Flow

The authentication tests follow this sequence:

```text
Signup
  │
  ▼
Login
  │
  ▼
Receive JWT
  │
  ▼
Use JWT for protected routes
  │
  ├── GET preferences
  │
  ├── PUT preferences
  │
  └── GET news
```

This allows the evaluator to verify the complete API flow rather than testing individual endpoints in isolation.

---

# Optional Extensions

The project brief provides several optional extensions:

### Caching

Cache news responses to reduce calls to the external API.

### Read/Favorite Articles

Possible endpoints:

```http
POST /news/:id/read
POST /news/:id/favorite
GET /news/read
GET /news/favorites
```

### Search

```http
GET /news/search/:keyword
```

### Periodic Cache Updates

Periodically refresh cached news in the background.

These are optional extensions and are separate from the required authentication, preferences, validation, and news-fetching functionality.

---

# Evaluation / Quick Start

For an evaluator, the quickest way to run the project is:

### 1. Install dependencies

```bash
npm install
```

### 2. Configure `.env`

```env
PORT=3000
MONGO_URI=<mongodb-connection-string>
JWT_SECRET_KEY=<jwt-secret>
NEWS_API_KEY=<newsdata-api-key>
```

### 3. Start the application

```bash
node server.js
```

### 4. Verify the server

```http
GET http://localhost:3000/
```

### 5. Register

```http
POST http://localhost:3000/users/signup
```

```json
{
  "name": "Clark Kent",
  "email": "clark@superman.com",
  "password": "Krypt()n8",
  "preferences": [
    "movies",
    "comics"
  ]
}
```

### 6. Login

```http
POST http://localhost:3000/users/login
```

```json
{
  "email": "clark@superman.com",
  "password": "Krypt()n8"
}
```

Copy the returned JWT.

### 7. Test protected routes

Use:

```http
Authorization: Bearer <JWT_TOKEN>
```

with:

```http
GET /users/preferences
PUT /users/preferences
GET /news
```

### 8. Run automated tests

```bash
npm test
```

---

# Security Notes

* Passwords are hashed with bcrypt.
* JWT is used for authentication.
* JWT secrets are stored in environment variables.
* External API keys are stored in environment variables.
* `.env` should not be committed to the repository.
* Authentication tokens should not be logged in production.

---

# Project Status

The required functionality from the project brief has been implemented:

* [x] Project setup
* [x] User registration
* [x] Password hashing with bcrypt
* [x] User login
* [x] JWT generation
* [x] JWT authentication middleware
* [x] Get user preferences
* [x] Update user preferences
* [x] External News API integration
* [x] Axios / async-await
* [x] Input validation
* [x] Error handling
* [x] Protected routes
* [x] Automated API tests

The caching, article read/favorite, search, and periodic cache update features are listed in the brief as optional extensions.
