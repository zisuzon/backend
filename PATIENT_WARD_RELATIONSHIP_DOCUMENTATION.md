# Patient-Ward Relationship API Documentation

## Overview

This document describes the complete patient-ward relationship management system in the Hospital Management System. The system allows assigning patients to wards, transferring them between wards, discharging them, and tracking ward occupancy.

## Updated Schema Relationships

### Patient Schema Updates

```javascript
{
  // ... existing fields ...
  assignedWard: { type: ObjectId, ref: 'Wards', required: false },
  assignedWardName: { type: String },
  bedNumber: { type: Number },
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date },
  isActive: { type: Boolean, default: true },
  wardHistory: [{
    wardId: { type: ObjectId, ref: 'Wards' },
    wardName: { type: String },
    bedNumber: { type: Number },
    assignedDate: { type: Date, default: Date.now },
    dischargedDate: { type: Date },
    reason: { type: String }
  }]
}
```

### Ward Schema Updates

```javascript
{
  // ... existing fields ...
  patients: [{
    patientId: { type: ObjectId, ref: 'Patients' },
    bedNumber: { type: Number, required: true },
    admissionDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  description: { type: String },
  isActive: { type: Boolean, default: true }
}
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/patient-ward
```

---

## 1. POST /api/patient-ward/assign

**Assign patient to ward**

### Request

- **Method**: POST
- **URL**: `/api/patient-ward/assign`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "bedNumber": 5,
  "reason": "Initial admission for cardiac care"
}
```

### Validation Rules

- `patientId`: Required, valid patient ID
- `wardId`: Required, valid ward ID
- `bedNumber`: Required, positive integer
- `reason`: Optional, non-empty string

### Response

```json
{
  "message": "Patient assigned to ward successfully.",
  "patient": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "assignedWard": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Cardiology Ward A",
      "type": "Cardiology",
      "totalBeds": 20,
      "totalOccupiedBeds": 15,
      "wardGender": "Mixed"
    },
    "assignedWardName": "Cardiology Ward A",
    "bedNumber": 5,
    "admissionDate": "2024-01-15T10:30:00.000Z",
    "wardHistory": [
      {
        "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "wardName": "Cardiology Ward A",
        "bedNumber": 5,
        "assignedDate": "2024-01-15T10:30:00.000Z",
        "reason": "Initial admission for cardiac care"
      }
    ]
  },
  "ward": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Cardiology Ward A",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "availableBeds": 5,
    "occupancyPercentage": 75
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/patient-ward/assign \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "bedNumber": 5,
    "reason": "Initial admission for cardiac care"
  }'
```

---

## 2. POST /api/patient-ward/transfer

**Transfer patient to different ward**

### Request

- **Method**: POST
- **URL**: `/api/patient-ward/transfer`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "newWardId": "64f8a1b2c3d4e5f6a7b8c9d2",
  "bedNumber": 3,
  "reason": "Transfer to ICU for intensive care"
}
```

### Validation Rules

- `patientId`: Required, valid patient ID
- `newWardId`: Required, valid ward ID
- `bedNumber`: Required, positive integer
- `reason`: Optional, non-empty string

### Response

```json
{
  "message": "Patient transferred successfully.",
  "patient": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "assignedWard": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "ICU Ward",
      "type": "ICU",
      "totalBeds": 10,
      "totalOccupiedBeds": 8,
      "wardGender": "Mixed"
    },
    "assignedWardName": "ICU Ward",
    "bedNumber": 3,
    "wardHistory": [
      {
        "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "wardName": "Cardiology Ward A",
        "bedNumber": 5,
        "assignedDate": "2024-01-15T10:30:00.000Z",
        "dischargedDate": "2024-01-16T14:20:00.000Z",
        "reason": "Initial admission for cardiac care"
      },
      {
        "wardId": "64f8a1b2c3d4e5f6a7b8c9d2",
        "wardName": "ICU Ward",
        "bedNumber": 3,
        "assignedDate": "2024-01-16T14:20:00.000Z",
        "reason": "Transfer to ICU for intensive care"
      }
    ]
  },
  "newWard": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "ICU Ward",
    "totalBeds": 10,
    "totalOccupiedBeds": 8,
    "availableBeds": 2,
    "occupancyPercentage": 80
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/patient-ward/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "newWardId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "bedNumber": 3,
    "reason": "Transfer to ICU for intensive care"
  }'
```

---

## 3. POST /api/patient-ward/discharge

**Discharge patient from ward**

### Request

- **Method**: POST
- **URL**: `/api/patient-ward/discharge`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:

```json
{
  "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "reason": "Patient recovered and ready for discharge"
}
```

### Validation Rules

- `patientId`: Required, valid patient ID
- `reason`: Optional, non-empty string

### Response

```json
{
  "message": "Patient discharged successfully.",
  "patient": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "assignedWard": null,
    "assignedWardName": null,
    "bedNumber": null,
    "dischargeDate": "2024-01-20T09:00:00.000Z",
    "isActive": false,
    "wardHistory": [
      {
        "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "wardName": "Cardiology Ward A",
        "bedNumber": 5,
        "assignedDate": "2024-01-15T10:30:00.000Z",
        "dischargedDate": "2024-01-16T14:20:00.000Z",
        "reason": "Initial admission for cardiac care"
      },
      {
        "wardId": "64f8a1b2c3d4e5f6a7b8c9d2",
        "wardName": "ICU Ward",
        "bedNumber": 3,
        "assignedDate": "2024-01-16T14:20:00.000Z",
        "dischargedDate": "2024-01-20T09:00:00.000Z",
        "reason": "Transfer to ICU for intensive care"
      }
    ]
  }
}
```

### Example

```bash
curl -X POST http://localhost:5000/api/patient-ward/discharge \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "reason": "Patient recovered and ready for discharge"
  }'
```

---

## 4. GET /api/patient-ward/ward/:wardId/patients

**Get all patients in a specific ward**

### Request

- **Method**: GET
- **URL**: `/api/patient-ward/ward/:wardId/patients`
- **Headers**: None required

### Response

```json
{
  "ward": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Cardiology Ward A",
    "type": "Cardiology",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "wardGender": "Mixed"
  },
  "patients": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "dateOfBirth": "1980-05-15",
      "gender": "Male",
      "contact": "+1234567890",
      "emergencyContact": "+1987654321",
      "history": "Previous heart surgery in 2020",
      "bedNumber": 5,
      "admissionDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/patient-ward/ward/64f8a1b2c3d4e5f6a7b8c9d1/patients
```

---

## 5. GET /api/patient-ward/ward/:wardId/occupancy

**Get detailed ward occupancy information**

### Request

- **Method**: GET
- **URL**: `/api/patient-ward/ward/:wardId/occupancy`
- **Headers**: None required

### Response

```json
{
  "ward": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Cardiology Ward A",
    "type": "Cardiology",
    "totalBeds": 20,
    "totalOccupiedBeds": 15,
    "wardGender": "Mixed"
  },
  "occupancy": {
    "totalBeds": 20,
    "occupiedBeds": 15,
    "availableBeds": 5,
    "occupancyPercentage": 75,
    "occupiedBedNumbers": [1, 2, 3, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19],
    "availableBedNumbers": [4, 6, 11, 18, 20]
  },
  "patients": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "dateOfBirth": "1980-05-15",
      "gender": "Male",
      "contact": "+1234567890",
      "bedNumber": 5,
      "admissionDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/patient-ward/ward/64f8a1b2c3d4e5f6a7b8c9d1/occupancy
```

---

## 6. GET /api/patient-ward/patient/:patientId/history

**Get patient's complete ward history**

### Request

- **Method**: GET
- **URL**: `/api/patient-ward/patient/:patientId/history`
- **Headers**: None required

### Response

```json
{
  "patient": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "currentWard": {
      "wardId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "wardName": "ICU Ward",
      "bedNumber": 3,
      "assignedDate": "2024-01-16T14:20:00.000Z",
      "reason": "Transfer to ICU for intensive care"
    }
  },
  "wardHistory": [
    {
      "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "wardName": "Cardiology Ward A",
      "bedNumber": 5,
      "assignedDate": "2024-01-15T10:30:00.000Z",
      "dischargedDate": "2024-01-16T14:20:00.000Z",
      "reason": "Initial admission for cardiac care"
    },
    {
      "wardId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "wardName": "ICU Ward",
      "bedNumber": 3,
      "assignedDate": "2024-01-16T14:20:00.000Z",
      "reason": "Transfer to ICU for intensive care"
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/patient-ward/patient/64f8a1b2c3d4e5f6a7b8c9d0/history
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Invalid patient ID."
}
```

### 404 Not Found

```json
{
  "message": "Patient not found."
}
```

### 422 Unprocessable Entity

```json
{
  "message": "Patient is already assigned to a ward."
}
```

### 500 Internal Server Error

```json
{
  "message": "Ward is full."
}
```

---

## Ward Management Features

### Automatic Bed Tracking

- ✅ **Available Beds**: Automatically calculated as `totalBeds - totalOccupiedBeds`
- ✅ **Occupancy Percentage**: Calculated as `(occupiedBeds / totalBeds) * 100`
- ✅ **Bed Number Validation**: Prevents assigning to occupied beds
- ✅ **Ward Capacity**: Prevents assignments when ward is full

### Patient History Tracking

- ✅ **Complete Ward History**: Tracks all ward assignments and transfers
- ✅ **Transfer Reasons**: Records reasons for ward transfers
- ✅ **Admission/Discharge Dates**: Tracks timing of all movements
- ✅ **Current Ward Status**: Virtual field for current ward assignment

### Ward Methods

- ✅ `assignPatient(patientId, bedNumber)`: Assign patient to specific bed
- ✅ `dischargePatient(patientId)`: Remove patient from ward
- ✅ `transferPatient(patientId, newBedNumber)`: Move patient within same ward

---

## Testing the API

### 1. Assign patient to ward

```bash
curl -X POST http://localhost:5000/api/patient-ward/assign \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "wardId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "bedNumber": 5,
    "reason": "Initial admission for cardiac care"
  }'
```

### 2. Transfer patient to different ward

```bash
curl -X POST http://localhost:5000/api/patient-ward/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "newWardId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "bedNumber": 3,
    "reason": "Transfer to ICU for intensive care"
  }'
```

### 3. Discharge patient

```bash
curl -X POST http://localhost:5000/api/patient-ward/discharge \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "reason": "Patient recovered and ready for discharge"
  }'
```

### 4. Get ward patients

```bash
curl -X GET http://localhost:5000/api/patient-ward/ward/WARD_ID_HERE/patients
```

### 5. Get ward occupancy

```bash
curl -X GET http://localhost:5000/api/patient-ward/ward/WARD_ID_HERE/occupancy
```

### 6. Get patient ward history

```bash
curl -X GET http://localhost:5000/api/patient-ward/patient/PATIENT_ID_HERE/history
```

## Notes

- All endpoints return JSON responses
- The API includes comprehensive validation for all input fields
- Bed numbers are automatically validated against ward capacity
- Ward occupancy is automatically updated when patients are assigned/discharged
- Complete patient ward history is maintained for audit purposes
- Virtual fields provide real-time calculations for occupancy and availability
- Error handling prevents invalid assignments and transfers
