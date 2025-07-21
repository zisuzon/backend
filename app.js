const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const patientsRoutes = require("./routes/patients-routes");
const usersRoutes = require("./routes/users-routes");
const wardsRoutes = require("./routes/wards-routes");
const doctorsRoutes = require("./routes/doctors-routes");
const doctorTeamsRoutes = require("./routes/doctor-teams-routes");
const patientWardRoutes = require("./routes/patient-ward-routes");
const HttpError = require("./models/http-error");

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(cors());

app.use("/api/patients", patientsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/wards", wardsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/doctor-teams", doctorTeamsRoutes);
app.use("/api/patient-ward", patientWardRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://zisuzon007:GBLkYfDRN1zvsdi5@cluster0.vbrandf.mongodb.net/hospital-management?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
  });

// Add connection event listeners for better monitoring
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected from MongoDB");
});

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGODB_USERID}:${process.env.MONGODB_PASSWORD}@cluster0.uujwbiy.mongodb.net/data-int?retryWrites=true&w=majority`
//   )
//   .then(() => {
//     app.listen(process.env.PORT || 5000);
//   })
//   .catch(err => {
//     console.log(err);
//   });
