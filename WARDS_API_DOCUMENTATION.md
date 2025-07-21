# Wards CRUD API Documentation

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) operations for the Wards management system in the Hospital Management System.

## Ward Schema

```javascript
{
  name: { type: String, required: true },
  type: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  totalOccupiedBeds: { type: Number, required: true },
  wardGender: { type: String, required: true } // "Male", "Female", or "Mixed"
}
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/wards
```

---

## 1. GET /api/wards

**Get all wards**

### Request

- **Method**: GET
- **URL**: `/api/wards`
- **Headers**: None required

### Response

```json
{
  "wards": [
    {
      "id": "ward_id_here",
      "name": "General Ward A",
      "type": "General",
      "totalBeds": 20,
      "totalOccupiedBeds": 15,
      "wardGender": "Mixed"
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/wards
```

---

## 2. GET /api/wards/:wardId

**Get ward by ID**

### Request

- **Method**: GET
- **URL**: `/api/wards/:wardId`
- **Headers**: None required

### Response

```json
{
  "ward": {
    "id": "ward_id_here",
    "name": "General Ward A",
    "type": "General",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "wardGender": "Mixed"
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/wards/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## 3. POST /api/wards

**Create new ward**

### Request

- **Method**: POST
- **URL**: `/api/wards`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "name": "General Ward A",
  "type": "General",
  "totalBeds": 20,
  "totalOccupiedBeds": 15,
  "wardGender": "Mixed"
}
```

### Validation Rules

- `name`: Required, non-empty string
- `type`: Required, non-empty string
- `totalBeds`: Required, integer, minimum 1
- `totalOccupiedBeds`: Required, integer, minimum 0
- `wardGender`: Required, must be "Male", "Female", or "Mixed"

### Response

```json
{
  "ward": {
    "id": "new_ward_id",
    "name": "General Ward A",
    "type": "General",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "wardGender": "Mixed"
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/wards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "General Ward A",
    "type": "General",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "wardGender": "Mixed"
  }'
```

---

## 4. PATCH /api/wards/:wardId

**Update ward**

### Request

- **Method**: PATCH
- **URL**: `/api/wards/:wardId`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "name": "Updated Ward Name",
  "type": "ICU",
  "totalBeds": 25,
  "totalOccupiedBeds": 20,
  "wardGender": "Male"
}
```

### Validation Rules

Same as POST endpoint

### Response

```json
{
  "ward": {
    "id": "ward_id_here",
    "name": "Updated Ward Name",
    "type": "ICU",
    "totalBeds": 25,
    "totalOccupiedBeds": 20,
    "wardGender": "Male"
  }
}
```

### Example

```bash
curl -X PATCH http://localhost:5000/api/wards/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Ward Name",
    "type": "ICU",
    "totalBeds": 25,
    "totalOccupiedBeds": 20,
    "wardGender": "Male"
  }'
```

---

## 5. DELETE /api/wards/:wardId

**Delete ward**

### Request

- **Method**: DELETE
- **URL**: `/api/wards/:wardId`
- **Headers**: None required

### Response

```json
{
  "message": "Ward deleted successfully."
}
```

### Example

```bash
curl -X DELETE http://localhost:5000/api/wards/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Invalid inputs passed, please check your data."
}
```

### 404 Not Found

```json
{
  "message": "Could not find ward for the provided id."
}
```

### 422 Unprocessable Entity

```json
{
  "message": "Invalid inputs passed, please check your data."
}
```

### 500 Internal Server Error

```json
{
  "message": "Something went wrong, could not [operation] ward."
}
```

---

## File Structure

```
backend/
├── controllers/
│   └── wards-controllers.js    # CRUD operations
├── routes/
│   └── wards-routes.js        # Route definitions
├── models/
│   └── wards.js               # Mongoose schema
└── app.js                     # Main application file
```

## Testing the API

### 1. Create a new ward

```bash
curl -X POST http://localhost:5000/api/wards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Ward",
    "type": "Emergency",
    "totalBeds": 30,
    "totalOccupiedBeds": 25,
    "wardGender": "Mixed"
  }'
```

### 2. Get all wards

```bash
curl -X GET http://localhost:5000/api/wards
```

### 3. Get specific ward

```bash
curl -X GET http://localhost:5000/api/wards/WARD_ID_HERE
```

### 4. Update ward

```bash
curl -X PATCH http://localhost:5000/api/wards/WARD_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Emergency Ward",
    "type": "Emergency",
    "totalBeds": 35,
    "totalOccupiedBeds": 30,
    "wardGender": "Mixed"
  }'
```

### 5. Delete ward

```bash
curl -X DELETE http://localhost:5000/api/wards/WARD_ID_HERE
```

## Notes

- All endpoints return JSON responses
- The API includes comprehensive validation for all input fields
- Error handling is implemented for all operations
- The system uses MongoDB with Mongoose for data persistence
- All timestamps and MongoDB ObjectIds are automatically handled
