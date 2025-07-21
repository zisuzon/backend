# Hospital Management System - Database Design Diagram

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    HOSPITAL MANAGEMENT SYSTEM                                  │
│                                         DATABASE DESIGN                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         USERS                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                                           │
│ name: String (required)                                                                       │
│ email: String (required, unique)                                                             │
│ password: String (required, hashed)                                                          │
│ image: String (optional)                                                                      │
│ createdAt: Date (auto)                                                                        │
│ updatedAt: Date (auto)                                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        DOCTORS                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                                           │
│ name: String (required)                                                                       │
│ licence: String (required)                                                                    │
│ designation: String (required)                                                                │
│ department: String (required)                                                                 │
│ teamId: String (required)                                                                     │
│ contact: String (required)                                                                    │
│ email: String (required)                                                                      │
│ address: String (required)                                                                    │
│ isActive: Boolean (required)                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     DOCTOR TEAMS                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                                           │
│ teamName: String (required)                                                                   │
│ teamCode: String (required, unique)                                                          │
│ department: String (required)                                                                 │
│ teamLead: ObjectId (FK → Doctors) (required)                                                 │
│ doctors: [ObjectId] (FK → Doctors[]) (required)                                              │
│ patients: [ObjectId] (FK → Patients[]) (optional)                                            │
│ description: String (optional)                                                                │
│ isActive: Boolean (default: true)                                                            │
│ createdAt: Date (auto)                                                                        │
│ updatedAt: Date (auto)                                                                        │
│                                                                                               │
│ Virtual Fields:                                                                               │
│ - teamSize: Number (calculated)                                                               │
│ - patientCount: Number (calculated)                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        WARDS                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                                           │
│ name: String (required)                                                                       │
│ type: String (required)                                                                       │
│ totalBeds: Number (required)                                                                  │
│ totalOccupiedBeds: Number (required)                                                          │
│ wardGender: String (required)                                                                 │
│ patients: [{                                                                                  │
│   patientId: ObjectId (FK → Patients),                                                       │
│   bedNumber: Number (required),                                                               │
│   admissionDate: Date (auto),                                                                 │
│   isActive: Boolean (default: true)                                                           │
│ }]                                                                                            │
│ description: String (optional)                                                                │
│ isActive: Boolean (default: true)                                                            │
│ createdAt: Date (auto)                                                                        │
│ updatedAt: Date (auto)                                                                        │
│                                                                                               │
│ Virtual Fields:                                                                               │
│ - availableBeds: Number (calculated)                                                          │
│ - occupancyPercentage: Number (calculated)                                                    │
│ - occupiedBedNumbers: [Number] (calculated)                                                   │
│ - availableBedNumbers: [Number] (calculated)                                                  │
│                                                                                               │
│ Methods:                                                                                      │
│ - assignPatient(patientId, bedNumber)                                                         │
│ - dischargePatient(patientId)                                                                 │
│ - transferPatient(patientId, newBedNumber)                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       PATIENTS                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                                           │
│ name: String (required)                                                                       │
│ dateOfBirth: String (required)                                                                │
│ gender: String (required)                                                                     │
│ contact: String (required)                                                                    │
│ emergencyContact: String (optional)                                                           │
│ history: String (optional)                                                                    │
│ assignedWard: ObjectId (FK → Wards) (optional)                                               │
│ assignedWardName: String (optional)                                                           │
│ bedNumber: Number (optional)                                                                  │
│ assignedTeam: ObjectId (FK → DoctorTeams) (optional)                                          │
│ assignedTeamName: String (optional)                                                           │
│ admissionDate: Date (auto)                                                                    │
│ dischargeDate: Date (optional)                                                                │
│ isActive: Boolean (default: true)                                                            │
│ wardHistory: [{                                                                               │
│   wardId: ObjectId (FK → Wards),                                                             │
│   wardName: String,                                                                           │
│   bedNumber: Number,                                                                          │
│   assignedDate: Date (auto),                                                                  │
│   dischargedDate: Date (optional),                                                            │
│   reason: String                                                                              │
│ }]                                                                                            │
│ createdAt: Date (auto)                                                                        │
│ updatedAt: Date (auto)                                                                        │
│                                                                                               │
│ Virtual Fields:                                                                               │
│ - currentWard: Object (calculated)                                                            │
│ - wardAssignmentDuration: Number (calculated)                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

```

## 🔗 Relationship Mappings

### One-to-Many Relationships:

1. **Users** → **Doctors** (One user can manage multiple doctors)
2. **Doctors** → **Doctor Teams** (One doctor can be in multiple teams)
3. **Wards** → **Patients** (One ward can have multiple patients)
4. **Doctor Teams** → **Patients** (One team can handle multiple patients)

### Many-to-Many Relationships:

1. **Doctors** ↔ **Doctor Teams** (Many doctors can be in many teams)
2. **Patients** ↔ **Wards** (Patients can be transferred between wards)
3. **Patients** ↔ **Doctor Teams** (Patients can be assigned to different teams)

### One-to-One Relationships:

1. **Doctor Teams** → **Doctors** (One team has one team lead)

## 📋 Field Details

### Users Collection

- **Primary Key**: `_id` (ObjectId)
- **Unique Fields**: `email`
- **Required Fields**: `name`, `email`, `password`
- **Indexes**: `email` (unique)

### Doctors Collection

- **Primary Key**: `_id` (ObjectId)
- **Required Fields**: `name`, `licence`, `designation`, `department`, `teamId`, `contact`, `email`, `address`, `isActive`
- **Indexes**: `email` (unique), `licence` (unique)

### Doctor Teams Collection

- **Primary Key**: `_id` (ObjectId)
- **Unique Fields**: `teamCode`
- **Required Fields**: `teamName`, `teamCode`, `department`, `teamLead`
- **Foreign Keys**: `teamLead` → `Doctors._id`, `doctors[]` → `Doctors._id`, `patients[]` → `Patients._id`
- **Indexes**: `teamCode` (unique)

### Wards Collection

- **Primary Key**: `_id` (ObjectId)
- **Required Fields**: `name`, `type`, `totalBeds`, `totalOccupiedBeds`, `wardGender`
- **Embedded Documents**: `patients[]` (contains patient assignments)
- **Methods**: `assignPatient()`, `dischargePatient()`, `transferPatient()`

### Patients Collection

- **Primary Key**: `_id` (ObjectId)
- **Required Fields**: `name`, `dateOfBirth`, `gender`, `contact`
- **Foreign Keys**: `assignedWard` → `Wards._id`, `assignedTeam` → `DoctorTeams._id`
- **Embedded Documents**: `wardHistory[]` (contains complete ward assignment history)

## 🔄 Data Flow

### Patient Admission Flow:

1. **Create Patient** → **Assign to Ward** → **Assign to Team**
2. **Ward Assignment** updates ward occupancy
3. **Team Assignment** links patient to medical team

### Patient Transfer Flow:

1. **Current Ward** → **Discharge** → **New Ward** → **Assign**
2. **Ward History** is updated with transfer details
3. **Bed Availability** is recalculated

### Doctor Team Management:

1. **Create Team** → **Assign Team Lead** → **Add Doctors** → **Assign Patients**
2. **Team Size** and **Patient Count** are automatically calculated

## 📊 Virtual Fields & Calculations

### Wards:

- `availableBeds = totalBeds - totalOccupiedBeds`
- `occupancyPercentage = (totalOccupiedBeds / totalBeds) * 100`
- `occupiedBedNumbers = [bed numbers currently occupied]`
- `availableBedNumbers = [bed numbers currently available]`

### Doctor Teams:

- `teamSize = doctors.length`
- `patientCount = patients.length`

### Patients:

- `currentWard = last active ward assignment`
- `wardAssignmentDuration = days since admission`

## 🛡️ Data Integrity Constraints

### Referential Integrity:

- All foreign key references are validated before assignment
- Patient assignments validate both ward and team existence
- Doctor team assignments validate doctor existence

### Business Rules:

- **Ward Capacity**: Cannot assign patients to full wards
- **Bed Conflicts**: Cannot assign multiple patients to same bed
- **Team Lead**: Must be an existing doctor
- **Patient Status**: Cannot assign discharged patients to new wards
- **Ward Gender**: Patient gender must match ward gender policy

### Validation Rules:

- **Email Format**: All email fields must be valid email format
- **Phone Numbers**: Contact numbers must be valid format
- **Dates**: All date fields must be valid dates
- **Numbers**: Bed numbers and counts must be positive integers
- **Strings**: Required string fields cannot be empty

## 🔍 Indexing Strategy

### Primary Indexes:

- `_id` (ObjectId) - All collections
- `email` (Users, Doctors) - Unique constraint
- `licence` (Doctors) - Unique constraint
- `teamCode` (Doctor Teams) - Unique constraint

### Secondary Indexes:

- `assignedWard` (Patients) - For ward queries
- `assignedTeam` (Patients) - For team queries
- `teamLead` (Doctor Teams) - For team lead queries
- `doctors` (Doctor Teams) - For team member queries
- `patients` (Doctor Teams) - For team patient queries

## 📈 Performance Considerations

### Query Optimization:

- **Population**: Related data is populated for efficient queries
- **Virtual Fields**: Calculated fields reduce computation overhead
- **Embedded Documents**: Ward history and patient assignments are embedded
- **Indexes**: Strategic indexing for common query patterns

### Scalability:

- **Pagination**: Large result sets are paginated
- **Selective Population**: Only required fields are populated
- **Efficient Updates**: Atomic operations for ward assignments
- **History Management**: Efficient ward history tracking

## 🏥 Hospital Management Workflow

### 1. Patient Admission:

```
Patient Registration → Ward Assignment → Team Assignment → Bed Assignment
```

### 2. Patient Transfer:

```
Current Ward → Discharge → New Ward → Bed Assignment → Team Update
```

### 3. Patient Discharge:

```
Ward Discharge → Team Removal → History Update → Status Change
```

### 4. Team Management:

```
Team Creation → Lead Assignment → Doctor Addition → Patient Assignment
```

This database design provides a robust, scalable foundation for hospital management with proper relationships, data integrity, and efficient querying capabilities.
