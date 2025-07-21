# Doctor Teams CRUD API Documentation

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) operations for the Doctor Teams management system in the Hospital Management System. Each team can have multiple doctors and multiple patients.

## Doctor Team Schema

```javascript
{
  teamName: { type: String, required: true, trim: true },
  teamCode: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true, trim: true },
  teamLead: { type: ObjectId, ref: 'Doctors', required: true },
  doctors: [{ type: ObjectId, ref: 'Doctors', required: true }],
  patients: [{ type: ObjectId, ref: 'Patients', required: false }],
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/doctor-teams
```

---

## 1. GET /api/doctor-teams

**Get all doctor teams**

### Request

- **Method**: GET
- **URL**: `/api/doctor-teams`
- **Headers**: None required

### Response

```json
{
  "teams": [
    {
      "id": "team_id_here",
      "teamName": "Cardiology Team A",
      "teamCode": "CARD_A",
      "department": "Cardiology",
      "teamLead": {
        "id": "doctor_id_1",
        "name": "Dr. John Smith",
        "designation": "Senior Cardiologist",
        "department": "Cardiology"
      },
      "doctors": [
        {
          "id": "doctor_id_1",
          "name": "Dr. John Smith",
          "designation": "Senior Cardiologist",
          "department": "Cardiology"
        },
        {
          "id": "doctor_id_2",
          "name": "Dr. Sarah Johnson",
          "designation": "Cardiologist",
          "department": "Cardiology"
        }
      ],
      "patients": [
        {
          "id": "patient_id_1",
          "name": "John Doe",
          "gender": "Male",
          "contact": "+1234567890"
        }
      ],
      "description": "Primary cardiology team for emergency cases",
      "isActive": true,
      "teamSize": 2,
      "patientCount": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/doctor-teams
```

---

## 2. GET /api/doctor-teams/:teamId

**Get doctor team by ID**

### Request

- **Method**: GET
- **URL**: `/api/doctor-teams/:teamId`
- **Headers**: None required

### Response

```json
{
  "team": {
    "id": "team_id_here",
    "teamName": "Cardiology Team A",
    "teamCode": "CARD_A",
    "department": "Cardiology",
    "teamLead": {
      "id": "doctor_id_1",
      "name": "Dr. John Smith",
      "licence": "MD123456",
      "designation": "Senior Cardiologist",
      "department": "Cardiology",
      "contact": "+1234567890",
      "email": "john.smith@hospital.com"
    },
    "doctors": [
      {
        "id": "doctor_id_1",
        "name": "Dr. John Smith",
        "licence": "MD123456",
        "designation": "Senior Cardiologist",
        "department": "Cardiology",
        "contact": "+1234567890",
        "email": "john.smith@hospital.com"
      }
    ],
    "patients": [
      {
        "id": "patient_id_1",
        "name": "John Doe",
        "dateOfBirth": "1980-05-15",
        "gender": "Male",
        "contact": "+1234567890",
        "emergencyContact": "+1987654321",
        "history": "Previous heart surgery in 2020"
      }
    ],
    "description": "Primary cardiology team for emergency cases",
    "isActive": true,
    "teamSize": 1,
    "patientCount": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/doctor-teams/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## 3. POST /api/doctor-teams

**Create new doctor team**

### Request

- **Method**: POST
- **URL**: `/api/doctor-teams`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "teamName": "Emergency Response Team",
  "teamCode": "ERT_001",
  "department": "Emergency Medicine",
  "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
  "doctors": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "patients": ["64f8a1b2c3d4e5f6a7b8c9d2"],
  "description": "24/7 emergency response team",
  "isActive": true
}
```

### Validation Rules

- `teamName`: Required, non-empty string
- `teamCode`: Required, non-empty string, must be unique
- `department`: Required, non-empty string
- `teamLead`: Required, valid doctor ID
- `doctors`: Optional, array of valid doctor IDs
- `patients`: Optional, array of valid patient IDs
- `description`: Optional, string
- `isActive`: Optional, boolean (defaults to true)

### Response

```json
{
  "team": {
    "id": "new_team_id",
    "teamName": "Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Smith",
      "designation": "Senior Emergency Physician",
      "department": "Emergency Medicine"
    },
    "doctors": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Dr. John Smith",
        "designation": "Senior Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Dr. Sarah Johnson",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      }
    ],
    "patients": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "gender": "Male",
        "contact": "+1234567890"
      }
    ],
    "description": "24/7 emergency response team",
    "isActive": true,
    "teamSize": 2,
    "patientCount": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/doctor-teams \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
    "doctors": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
    "patients": ["64f8a1b2c3d4e5f6a7b8c9d2"],
    "description": "24/7 emergency response team",
    "isActive": true
  }'
```

---

## 4. PATCH /api/doctor-teams/:teamId

**Update doctor team**

### Request

- **Method**: PATCH
- **URL**: `/api/doctor-teams/:teamId`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "teamName": "Updated Emergency Response Team",
  "teamCode": "ERT_001",
  "department": "Emergency Medicine",
  "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
  "doctors": [
    "64f8a1b2c3d4e5f6a7b8c9d0",
    "64f8a1b2c3d4e5f6a7b8c9d1",
    "64f8a1b2c3d4e5f6a7b8c9d3"
  ],
  "patients": ["64f8a1b2c3d4e5f6a7b8c9d2", "64f8a1b2c3d4e5f6a7b8c9d4"],
  "description": "Updated 24/7 emergency response team",
  "isActive": true
}
```

### Validation Rules

Same as POST endpoint (all fields optional for updates)

### Response

```json
{
  "team": {
    "id": "team_id_here",
    "teamName": "Updated Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Smith",
      "designation": "Senior Emergency Physician",
      "department": "Emergency Medicine"
    },
    "doctors": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Dr. John Smith",
        "designation": "Senior Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Dr. Sarah Johnson",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "name": "Dr. Michael Brown",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      }
    ],
    "patients": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "gender": "Male",
        "contact": "+1234567890"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "name": "Jane Smith",
        "gender": "Female",
        "contact": "+1987654321"
      }
    ],
    "description": "Updated 24/7 emergency response team",
    "isActive": true,
    "teamSize": 3,
    "patientCount": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### Example

```bash
curl -X PATCH http://localhost:5000/api/doctor-teams/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Updated Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
    "doctors": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1", "64f8a1b2c3d4e5f6a7b8c9d3"],
    "patients": ["64f8a1b2c3d4e5f6a7b8c9d2", "64f8a1b2c3d4e5f6a7b8c9d4"],
    "description": "Updated 24/7 emergency response team",
    "isActive": true
  }'
```

---

## 5. DELETE /api/doctor-teams/:teamId

**Delete doctor team**

### Request

- **Method**: DELETE
- **URL**: `/api/doctor-teams/:teamId`
- **Headers**: None required

### Response

```json
{
  "message": "Doctor team deleted successfully."
}
```

### Example

```bash
curl -X DELETE http://localhost:5000/api/doctor-teams/64f8a1b2c3d4e5f6a7b8c9d0
```

---

## 6. POST /api/doctor-teams/:teamId/doctors

**Add doctor to team**

### Request

- **Method**: POST
- **URL**: `/api/doctor-teams/:teamId/doctors`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
}
```

### Response

```json
{
  "team": {
    "id": "team_id_here",
    "teamName": "Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Smith",
      "designation": "Senior Emergency Physician",
      "department": "Emergency Medicine"
    },
    "doctors": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Dr. John Smith",
        "designation": "Senior Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Dr. Sarah Johnson",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "name": "Dr. Michael Brown",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      }
    ],
    "teamSize": 3
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/doctor-teams/64f8a1b2c3d4e5f6a7b8c9d0/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
  }'
```

---

## 7. DELETE /api/doctor-teams/:teamId/doctors

**Remove doctor from team**

### Request

- **Method**: DELETE
- **URL**: `/api/doctor-teams/:teamId/doctors`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
}
```

### Response

```json
{
  "team": {
    "id": "team_id_here",
    "teamName": "Emergency Response Team",
    "teamCode": "ERT_001",
    "department": "Emergency Medicine",
    "teamLead": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Smith",
      "designation": "Senior Emergency Physician",
      "department": "Emergency Medicine"
    },
    "doctors": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Dr. John Smith",
        "designation": "Senior Emergency Physician",
        "department": "Emergency Medicine"
      },
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Dr. Sarah Johnson",
        "designation": "Emergency Physician",
        "department": "Emergency Medicine"
      }
    ],
    "teamSize": 2
  }
}
```

### Example

```bash
curl -X DELETE http://localhost:5000/api/doctor-teams/64f8a1b2c3d4e5f6a7b8c9d0/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
  }'
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Doctor ID is required."
}
```

### 404 Not Found

```json
{
  "message": "Could not find doctor team for the provided id."
}
```

### 422 Unprocessable Entity

```json
{
  "message": "Team code already exists."
}
```

### 500 Internal Server Error

```json
{
  "message": "Something went wrong, could not [operation] doctor team."
}
```

---

## File Structure

```
backend/
├── controllers/
│   └── doctor-teams-controllers.js    # CRUD operations
├── routes/
│   └── doctor-teams-routes.js        # Route definitions
├── models/
│   └── doctor-team.js                # Mongoose schema
└── app.js                            # Main application file
```

## Testing the API

### 1. Create a new doctor team

```bash
curl -X POST http://localhost:5000/api/doctor-teams \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Cardiology Team A",
    "teamCode": "CARD_A",
    "department": "Cardiology",
    "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
    "doctors": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
    "patients": ["64f8a1b2c3d4e5f6a7b8c9d2"],
    "description": "Primary cardiology team for emergency cases",
    "isActive": true
  }'
```

### 2. Get all doctor teams

```bash
curl -X GET http://localhost:5000/api/doctor-teams
```

### 3. Get specific doctor team

```bash
curl -X GET http://localhost:5000/api/doctor-teams/TEAM_ID_HERE
```

### 4. Update doctor team

```bash
curl -X PATCH http://localhost:5000/api/doctor-teams/TEAM_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Updated Cardiology Team A",
    "teamCode": "CARD_A",
    "department": "Cardiology",
    "teamLead": "64f8a1b2c3d4e5f6a7b8c9d0",
    "doctors": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1", "64f8a1b2c3d4e5f6a7b8c9d3"],
    "patients": ["64f8a1b2c3d4e5f6a7b8c9d2", "64f8a1b2c3d4e5f6a7b8c9d4"],
    "description": "Updated primary cardiology team for emergency cases",
    "isActive": true
  }'
```

### 5. Add doctor to team

```bash
curl -X POST http://localhost:5000/api/doctor-teams/TEAM_ID_HERE/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
  }'
```

### 6. Remove doctor from team

```bash
curl -X DELETE http://localhost:5000/api/doctor-teams/TEAM_ID_HERE/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "64f8a1b2c3d4e5f6a7b8c9d3"
  }'
```

### 7. Delete doctor team

```bash
curl -X DELETE http://localhost:5000/api/doctor-teams/TEAM_ID_HERE
```

## Notes

- All endpoints return JSON responses
- The API includes comprehensive validation for all input fields
- Team codes must be unique across the system
- Doctor and patient IDs are validated before being added to teams
- Virtual fields (teamSize, patientCount) are automatically calculated
- All timestamps are automatically managed
- The system uses MongoDB with Mongoose for data persistence
- Related data (doctors, patients) is populated in responses
- Error handling is implemented for all operations
