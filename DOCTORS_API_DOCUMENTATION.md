# Doctors CRUD API Documentation

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) operations for the Doctors management system in the Hospital Management System.

## Doctor Schema

```javascript
{
  name: { type: String, required: true },
  licence: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  teamId: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, required: true }
}
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/doctors
```

---

## 1. GET /api/doctors

**Get all doctors**

### Request

- **Method**: GET
- **URL**: `/api/doctors`
- **Headers**: None required

### Response

```json
{
  "doctors": [
    {
      "id": "doctor_id_here",
      "name": "Dr. John Smith",
      "licence": "MD123456",
      "designation": "Senior Cardiologist",
      "department": "Cardiology",
      "teamId": "TEAM001",
      "contact": "+1234567890",
      "email": "john.smith@hospital.com",
      "address": "123 Medical Center Dr, City, State",
      "isActive": true
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/doctors
```

---

## 2. GET /api/doctors/:doctorId

**Get doctor by ID**

### Request

- **Method**: GET
- **URL**: `/api/doctors/:doctorId`
- **Headers**: None required

### Response

```json
{
  "doctor": {
    "id": "doctor_id_here",
    "name": "Dr. John Smith",
    "licence": "MD123456",
    "designation": "Senior Cardiologist",
    "department": "Cardiology",
    "teamId": "TEAM001",
    "contact": "+1234567890",
    "email": "john.smith@hospital.com",
    "address": "123 Medical Center Dr, City, State",
    "isActive": true
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/doctors/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## 3. POST /api/doctors

**Create new doctor**

### Request

- **Method**: POST
- **URL**: `/api/doctors`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "name": "Dr. Sarah Johnson",
  "licence": "MD789012",
  "designation": "Pediatrician",
  "department": "Pediatrics",
  "teamId": "TEAM002",
  "contact": "+1987654321",
  "email": "sarah.johnson@hospital.com",
  "address": "456 Children's Hospital Ave, City, State",
  "isActive": true
}
```

### Validation Rules

- `name`: Required, non-empty string
- `licence`: Required, non-empty string (medical license number)
- `designation`: Required, non-empty string (job title/position)
- `department`: Required, non-empty string (medical department)
- `teamId`: Required, non-empty string (team identifier)
- `contact`: Required, non-empty string (phone number)
- `email`: Required, valid email format
- `address`: Required, non-empty string
- `isActive`: Required, boolean value (true/false)

### Response

```json
{
  "doctor": {
    "id": "new_doctor_id",
    "name": "Dr. Sarah Johnson",
    "licence": "MD789012",
    "designation": "Pediatrician",
    "department": "Pediatrics",
    "teamId": "TEAM002",
    "contact": "+1987654321",
    "email": "sarah.johnson@hospital.com",
    "address": "456 Children's Hospital Ave, City, State",
    "isActive": true
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Johnson",
    "licence": "MD789012",
    "designation": "Pediatrician",
    "department": "Pediatrics",
    "teamId": "TEAM002",
    "contact": "+1987654321",
    "email": "sarah.johnson@hospital.com",
    "address": "456 Children Hospital Ave, City, State",
    "isActive": true
  }'
```

---

## 4. PATCH /api/doctors/:doctorId

**Update doctor**

### Request

- **Method**: PATCH
- **URL**: `/api/doctors/:doctorId`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "name": "Dr. Sarah Johnson-Smith",
  "licence": "MD789012",
  "designation": "Senior Pediatrician",
  "department": "Pediatrics",
  "teamId": "TEAM002",
  "contact": "+1987654321",
  "email": "sarah.johnson@hospital.com",
  "address": "456 Children Hospital Ave, City, State",
  "isActive": true
}
```

### Validation Rules

Same as POST endpoint

### Response

```json
{
  "doctor": {
    "id": "doctor_id_here",
    "name": "Dr. Sarah Johnson-Smith",
    "licence": "MD789012",
    "designation": "Senior Pediatrician",
    "department": "Pediatrics",
    "teamId": "TEAM002",
    "contact": "+1987654321",
    "email": "sarah.johnson@hospital.com",
    "address": "456 Children Hospital Ave, City, State",
    "isActive": true
  }
}
```

### Example

```bash
curl -X PATCH http://localhost:5000/api/doctors/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Johnson-Smith",
    "licence": "MD789012",
    "designation": "Senior Pediatrician",
    "department": "Pediatrics",
    "teamId": "TEAM002",
    "contact": "+1987654321",
    "email": "sarah.johnson@hospital.com",
    "address": "456 Children Hospital Ave, City, State",
    "isActive": true
  }'
```

---

## 5. DELETE /api/doctors/:doctorId

**Delete doctor**

### Request

- **Method**: DELETE
- **URL**: `/api/doctors/:doctorId`
- **Headers**: None required

### Response

```json
{
  "message": "Doctor deleted successfully."
}
```

### Example

```bash
curl -X DELETE http://localhost:5000/api/doctors/64f8a1b2c3d4e5f6a7b8c9d0
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
  "message": "Could not find doctor for the provided id."
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
  "message": "Something went wrong, could not [operation] doctor."
}
```

---

## File Structure

```
backend/
├── controllers/
│   └── doctors-controllers.js    # CRUD operations
├── routes/
│   └── doctors-routes.js        # Route definitions
├── models/
│   └── doctors.js               # Mongoose schema
└── app.js                       # Main application file
```

## Testing the API

### 1. Create a new doctor

```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Michael Brown",
    "licence": "MD345678",
    "designation": "Emergency Physician",
    "department": "Emergency Medicine",
    "teamId": "TEAM003",
    "contact": "+1555123456",
    "email": "michael.brown@hospital.com",
    "address": "789 Emergency Center Blvd, City, State",
    "isActive": true
  }'
```

### 2. Get all doctors

```bash
curl -X GET http://localhost:5000/api/doctors
```

### 3. Get specific doctor

```bash
curl -X GET http://localhost:5000/api/doctors/DOCTOR_ID_HERE
```

### 4. Update doctor

```bash
curl -X PATCH http://localhost:5000/api/doctors/DOCTOR_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Michael Brown",
    "licence": "MD345678",
    "designation": "Senior Emergency Physician",
    "department": "Emergency Medicine",
    "teamId": "TEAM003",
    "contact": "+1555123456",
    "email": "michael.brown@hospital.com",
    "address": "789 Emergency Center Blvd, City, State",
    "isActive": true
  }'
```

### 5. Delete doctor

```bash
curl -X DELETE http://localhost:5000/api/doctors/DOCTOR_ID_HERE
```

## Notes

- All endpoints return JSON responses
- The API includes comprehensive validation for all input fields
- Email addresses are automatically normalized and validated
- Boolean fields (isActive) must be true or false
- Error handling is implemented for all operations
- The system uses MongoDB with Mongoose for data persistence
- All timestamps and MongoDB ObjectIds are automatically handled
