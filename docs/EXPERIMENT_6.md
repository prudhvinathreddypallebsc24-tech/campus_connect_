# Experiment 6
## Developing and Consuming Backend Services Using RESTful API Principles

**Course:** CS3301 Full Stack Development  
**Experiment Number:** 6  
**Date:** September 2026

---

## Aim

To develop and consume backend services that follow RESTful API principles, supporting basic CRUD operations with middleware handling using Node.js and Express.

---

## Problem Statement

Campus Connect requires a backend service to manage student records across the platform. This experiment implements a RESTful API using Node.js and Express that supports full CRUD (Create, Read, Update, Delete) operations on a student resource. The API demonstrates proper REST principles, middleware architecture, HTTP status codes, input validation, and structured JSON responses.

---

## Learning Outcomes

| # | Learning Outcome | How Demonstrated |
|---|-----------------|-----------------|
| 1 | Explain the purpose of a backend server and REST API | `server.js` listens on port 5000, handles HTTP requests, returns JSON |
| 2 | Understand CRUD and their HTTP methods | GET/POST/PUT/DELETE mapped to Read/Create/Update/Delete |
| 3 | Design API routes for CRUD operations | `routes/studentRoutes.js` defines all 5 endpoints |
| 4 | Understand middleware in request handling | 4 middleware layers: json, cors, logger, errorHandler |
| 5 | Test API endpoints using Postman | Postman collection provided in `docs/` |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for routing and middleware |
| **CORS** | Cross-origin resource sharing for frontend access |
| **Nodemon** | Auto-restart server on file changes (development) |
| **Postman** | API testing tool |

---

## Server Architecture

```
Postman / Frontend (React - port 5173)
              |
              | HTTP Request
              v
  ┌─────────────────────────────┐
  │   Express Server            │
  │   http://localhost:5000     │
  └──────────┬──────────────────┘
             │
             v
  ┌──────────────────────────────┐
  │  MIDDLEWARE PIPELINE         │
  │                              │
  │  1. cors()                   │  ← Allow cross-origin requests
  │         ↓                    │
  │  2. express.json()           │  ← Parse JSON request body
  │         ↓                    │
  │  3. logger (custom)          │  ← Log [timestamp] METHOD /path
  │         ↓                    │
  └──────────┬───────────────────┘
             │
             v
  ┌──────────────────────────────┐
  │  ROUTES                      │
  │  /api/students → studentRoutes│
  └──────────┬───────────────────┘
             │
             v
  ┌──────────────────────────────┐
  │  CONTROLLER                  │
  │  studentController.js        │
  │  getAllStudents()             │
  │  getStudentById()            │
  │  createStudent()             │
  │  updateStudent()             │
  │  deleteStudent()             │
  └──────────┬───────────────────┘
             │
             v
  ┌──────────────────────────────┐
  │  DATA STORE                  │
  │  data/students.js            │
  │  (In-memory array)           │
  └──────────┬───────────────────┘
             │
             v
         JSON Response

  On Error:
  Controller → next(error) → errorHandler → JSON Error Response

  Unmatched Route:
  notFound middleware → 404 JSON Response
```

---

## Project File Structure

```
server/
├── server.js                    ← Entry point, middleware + route setup
├── package.json
│
├── routes/
│   └── studentRoutes.js         ← Route definitions (URL → controller)
│
├── controllers/
│   └── studentController.js     ← CRUD logic, validation, responses
│
├── middleware/
│   ├── logger.js                ← Logs all requests with timestamp
│   ├── errorHandler.js          ← Central error response handler
│   └── notFound.js              ← 404 handler for unmatched routes
│
└── data/
    └── students.js              ← In-memory student data store
```

---

## REST Resource: Student

### Schema

```json
{
  "id":         "STU001",
  "name":       "Abhishek Patil",
  "email":      "abhishek@campusconnect.edu",
  "department": "Computer Science",
  "year":       2,
  "skills":     ["JavaScript", "React", "Node.js"]
}
```

---

## CRUD Operations

| Operation | HTTP Method | Endpoint | Status |
|-----------|-------------|----------|--------|
| **Create** | `POST` | `/api/students` | 201 Created |
| **Read All** | `GET` | `/api/students` | 200 OK |
| **Read One** | `GET` | `/api/students/:id` | 200 OK |
| **Update** | `PUT` | `/api/students/:id` | 200 OK |
| **Delete** | `DELETE` | `/api/students/:id` | 200 OK |

---

## API Endpoints

### GET /api/students — Read All

**Request:**
```
GET http://localhost:5000/api/students
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "STU001",
      "name": "Abhishek Patil",
      "email": "abhishek@campusconnect.edu",
      "department": "Computer Science",
      "year": 2,
      "skills": ["JavaScript", "React", "Node.js"]
    }
  ]
}
```

---

### GET /api/students/:id — Read One

**Request:**
```
GET http://localhost:5000/api/students/STU001
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Response (404 — not found):**
```json
{
  "success": false,
  "message": "Student with ID 'INVALID' not found"
}
```

---

### POST /api/students — Create

**Request:**
```
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "New Student",
  "email": "new@example.com",
  "department": "Computer Science",
  "year": 2,
  "skills": ["Java", "Node.js"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "STU004",
    ...
  }
}
```

**Response (400 — validation error):**
```json
{
  "success": false,
  "message": "Name is required"
}
```

---

### PUT /api/students/:id — Update

**Request:**
```
PUT http://localhost:5000/api/students/STU001
Content-Type: application/json

{
  "year": 3,
  "skills": ["React", "Node.js", "AWS"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": { ... }
}
```

---

### DELETE /api/students/:id — Delete

**Request:**
```
DELETE http://localhost:5000/api/students/STU001
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": { ... }
}
```

---

## Middleware Explained

### 1. `express.json()`
- **Built into Express**
- Parses incoming requests with `Content-Type: application/json`
- Populates `req.body` with the parsed JSON object
- Without this, `req.body` is `undefined` for POST/PUT requests

### 2. `cors()`
- Allows the React frontend (port 5173) to make requests to this API (port 5000)
- Without CORS, browsers block cross-origin requests

### 3. Logger Middleware (`middleware/logger.js`)
- **Custom middleware** — demonstrates the middleware pattern
- Runs for EVERY request before it reaches the route
- Logs: `[2026-09-18T...] POST /api/students`
- Calls `next()` to pass control to the next middleware

### 4. Not Found Middleware (`middleware/notFound.js`)
- Registered AFTER all routes
- Catches any request that didn't match a route
- Returns 404 JSON response

### 5. Error Handler Middleware (`middleware/errorHandler.js`)
- **4-parameter Express error handler:** `(err, req, res, next)`
- Controllers call `next(error)` to forward errors here
- Returns consistent JSON error responses
- Prevents stack traces from leaking to clients

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing/invalid input |
| `404` | Not Found | Student ID doesn't exist, or unknown route |
| `500` | Internal Server Error | Unexpected server errors |

---

## Input Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required, non-empty string |
| `email` | Required, valid email format |
| `department` | Required, non-empty string |
| `year` | Required, integer between 1–5 |
| `skills` | Optional, must be an array if provided |

---

## Testing Results

All endpoints were tested using PowerShell `Invoke-RestMethod` and are ready for Postman testing.

| Test | Method | Endpoint | Expected | Result |
|------|--------|----------|----------|--------|
| 1 | GET | `/api/students` | 200 + all students | ✅ Pass |
| 2 | GET | `/api/students/STU001` | 200 + student | ✅ Pass |
| 3 | GET | `/api/students/INVALID` | 404 | ✅ Pass |
| 4 | POST | `/api/students` (valid body) | 201 + new student | ✅ Pass |
| 5 | POST | `/api/students` (missing name) | 400 validation error | ✅ Pass |
| 6 | PUT | `/api/students/STU001` | 200 + updated student | ✅ Pass |
| 7 | DELETE | `/api/students/STU002` | 200 + deleted student | ✅ Pass |
| 8 | GET | `/api/students/STU002` (after delete) | 404 | ✅ Pass |
| 9 | GET | `/api/unknown-route` | 404 route not found | ✅ Pass |

---

## How to Run the Server

```bash
# Navigate to server directory
cd server

# Install dependencies (already installed)
npm install

# Start with nodemon (auto-restart on changes) — recommended
npm run dev

# OR start with Node directly
npm start
```

Server will start at: **http://localhost:5000**

---

## How to Test with Postman

1. Open Postman
2. Click **Import**
3. Select file: `docs/Campus-Connect-Experiment-6.postman_collection.json`
4. The collection loads with all requests pre-configured
5. Make sure the server is running (`npm run dev`)
6. Click any request → click **Send**

The `{{baseUrl}}` variable is preset to `http://localhost:5000`.

---

## Version Control

| Hash | Commit Message |
|------|---------------|
| *(see git log)* | `feat: build Campus Connect Express server` |
| *(see git log)* | `feat: add student REST CRUD endpoints` |
| *(see git log)* | `feat: add request logging and error middleware` |
| *(see git log)* | `docs: add Postman collection and Experiment 6 documentation` |

---

## Conclusion

Experiment 6 successfully implements a complete RESTful backend API using Node.js and Express. The implementation demonstrates:

1. **REST Principles** — resource-based URLs, correct HTTP methods, stateless communication
2. **CRUD Operations** — all four operations implemented and tested
3. **Middleware** — 4 middleware layers: cors, json parser, logger, error handler
4. **Validation** — input validated before processing, errors returned as JSON
5. **HTTP Status Codes** — correct codes for each operation type
6. **Modular Architecture** — routes, controllers, middleware, and data cleanly separated

The API is ready to be consumed by the Campus Connect React frontend (Experiment 7 integration).
