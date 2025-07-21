# Patients CRUD API Documentation

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) operations for the Patients management system in the Hospital Management System.

## Patient Schema

```javascript
{
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  emergencyContact: { type: String, required: false },
  history: { type: String },
  assignedWard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
    required: false,
  },
  assignedWardName: { type: String }, // For quick reference
  bedNumber: { type: Number }, // Specific bed number in the ward
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorsTeam",
    required: false,
  },
  assignedTeamName: { type: String }, // For quick reference
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date },
  isActive: { type: Boolean, default: true },
  wardHistory: [
    {
      wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Wards" },
      wardName: { type: String },
      bedNumber: { type: Number },
      assignedDate: { type: Date, default: Date.now },
      dischargedDate: { type: Date },
      reason: { type: String }, // Reason for transfer
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/patients
```

---

## 1. GET /api/patients

**Get all patients**

### Request

- **Method**: GET
- **URL**: `/api/patients`
- **Headers**: None required
- **Authentication**: Not required (Public endpoint)

### Response

```json
{
  "patients": [
    {
      "id": "patient_id_here",
      "name": "John Doe",
      "dateOfBirth": "1990-05-15",
      "gender": "Male",
      "contact": "+1234567890",
      "emergencyContact": "+1234567891",
      "history": "Previous heart condition",
      "assignedWard": "ward_id_here",
      "assignedWardName": "General Ward A",
      "bedNumber": 5,
      "assignedTeam": "team_id_here",
      "assignedTeamName": "Cardiology Team",
      "admissionDate": "2024-01-15T10:30:00.000Z",
      "dischargeDate": null,
      "isActive": true,
      "wardHistory": [
        {
          "wardId": "ward_id_here",
          "wardName": "General Ward A",
          "bedNumber": 5,
          "assignedDate": "2024-01-15T10:30:00.000Z",
          "dischargedDate": null,
          "reason": "Initial admission"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "currentWard": {
        "wardId": "ward_id_here",
        "wardName": "General Ward A",
        "bedNumber": 5,
        "assignedDate": "2024-01-15T10:30:00.000Z",
        "dischargedDate": null,
        "reason": "Initial admission"
      },
      "wardAssignmentDuration": 5
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/patients
```

---

## 2. GET /api/patients/:patientId

**Get patient by ID**

### Request

- **Method**: GET
- **URL**: `/api/patients/:patientId`
- **Headers**: None required
- **Authentication**: Not required (Public endpoint)

### Response

```json
{
  "patient": {
    "id": "patient_id_here",
    "name": "John Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Previous heart condition",
    "assignedWard": "ward_id_here",
    "assignedWardName": "General Ward A",
    "bedNumber": 5,
    "assignedTeam": "team_id_here",
    "assignedTeamName": "Cardiology Team",
    "admissionDate": "2024-01-15T10:30:00.000Z",
    "dischargeDate": null,
    "isActive": true,
    "wardHistory": [
      {
        "wardId": "ward_id_here",
        "wardName": "General Ward A",
        "bedNumber": 5,
        "assignedDate": "2024-01-15T10:30:00.000Z",
        "dischargedDate": null,
        "reason": "Initial admission"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "currentWard": {
      "wardId": "ward_id_here",
      "wardName": "General Ward A",
      "bedNumber": 5,
      "assignedDate": "2024-01-15T10:30:00.000Z",
      "dischargedDate": null,
      "reason": "Initial admission"
    },
    "wardAssignmentDuration": 5
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/patients/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## 3. POST /api/patients

**Create new patient**

### Request

- **Method**: POST
- **URL**: `/api/patients`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- **Authentication**: Required
- **Body**:

```json
{
  "name": "John Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "contact": "+1234567890",
  "emergencyContact": "+1234567891",
  "history": "Previous heart condition",
  "assignedWard": "ward_id_here",
  "assignedTeam": "team_id_here"
}
```

### Validation Rules

- `name`: Required, non-empty string
- `dateOfBirth`: Required, non-empty string
- `gender`: Required, non-empty string
- `contact`: Required, non-empty string
- `emergencyContact`: Optional string
- `history`: Optional string
- `assignedWard`: Optional ObjectId reference to Wards
- `assignedTeam`: Optional ObjectId reference to DoctorsTeam

### Response

```json
{
  "patient": {
    "id": "new_patient_id",
    "name": "John Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Previous heart condition",
    "assignedWard": "ward_id_here",
    "assignedWardName": null,
    "bedNumber": null,
    "assignedTeam": "team_id_here",
    "assignedTeamName": null,
    "admissionDate": "2024-01-15T10:30:00.000Z",
    "dischargeDate": null,
    "isActive": true,
    "wardHistory": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Previous heart condition",
    "assignedWard": "ward_id_here",
    "assignedTeam": "team_id_here"
  }'
```

---

## 4. PATCH /api/patients/:patientId

**Update patient**

### Request

- **Method**: PATCH
- **URL**: `/api/patients/:patientId`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- **Authentication**: Required
- **Body**:

```json
{
  "name": "John Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "contact": "+1234567890",
  "emergencyContact": "+1234567891",
  "history": "Updated medical history",
  "assignedWard": "new_ward_id_here",
  "assignedTeam": "new_team_id_here"
}
```

### Validation Rules

Same as POST endpoint

### Response

```json
{
  "patient": {
    "id": "patient_id_here",
    "name": "John Smith",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Updated medical history",
    "assignedWard": "new_ward_id_here",
    "assignedWardName": null,
    "bedNumber": null,
    "assignedTeam": "new_team_id_here",
    "assignedTeamName": null,
    "admissionDate": "2024-01-15T10:30:00.000Z",
    "dischargeDate": null,
    "isActive": true,
    "wardHistory": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### Example

```bash
curl -X PATCH http://localhost:5000/api/patients/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Smith",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Updated medical history",
    "assignedWard": "new_ward_id_here",
    "assignedTeam": "new_team_id_here"
  }'
```

---

## 5. DELETE /api/patients/:patientId

**Delete patient**

### Request

- **Method**: DELETE
- **URL**: `/api/patients/:patientId`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Authentication**: Required

### Response

```json
{
  "message": "John Doe has been deleted successfully!"
}
```

### Example

```bash
curl -X DELETE http://localhost:5000/api/patients/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Invalid inputs passed, please check your data."
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication failed!"
}
```

### 404 Not Found

```json
{
  "message": "Could not find the patient for the provided id."
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
  "message": "Something went wrong, could not [operation] patient."
}
```

---

## Virtual Properties

The patient model includes several virtual properties that are automatically calculated:

### currentWard

Returns the current ward assignment from the wardHistory array (the most recent non-discharged assignment).

### wardAssignmentDuration

Calculates the number of days since admission date.

---

## File Structure

```
backend/
├── controllers/
│   └── paitents-controllers.js    # CRUD operations
├── routes/
│   └── patients-routes.js        # Route definitions
├── models/
│   └── patients.js               # Mongoose schema
└── app.js                        # Main application file
```

## Testing the API

### 1. Create a new patient

```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "dateOfBirth": "1985-08-20",
    "gender": "Female",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Diabetes type 2",
    "assignedWard": "ward_id_here",
    "assignedTeam": "team_id_here"
  }'
```

### 2. Get all patients

```bash
curl -X GET http://localhost:5000/api/patients
```

### 3. Get specific patient

```bash
curl -X GET http://localhost:5000/api/patients/PATIENT_ID_HERE
```

### 4. Update patient

```bash
curl -X PATCH http://localhost:5000/api/patients/PATIENT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "dateOfBirth": "1985-08-20",
    "gender": "Female",
    "contact": "+1234567890",
    "emergencyContact": "+1234567891",
    "history": "Updated diabetes management",
    "assignedWard": "new_ward_id_here",
    "assignedTeam": "new_team_id_here"
  }'
```

### 5. Delete patient

```bash
curl -X DELETE http://localhost:5000/api/patients/PATIENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Notes

- All endpoints return JSON responses
- The API includes comprehensive validation for all required input fields
- Error handling is implemented for all operations
- The system uses MongoDB with Mongoose for data persistence
- All timestamps and MongoDB ObjectIds are automatically handled
- Virtual properties provide calculated fields for current ward assignment and duration
- Authentication is required for POST, PATCH, and DELETE operations
- GET operations are public and do not require authentication
- The patient model maintains a history of ward assignments
- The system automatically tracks admission dates and can handle discharge dates
