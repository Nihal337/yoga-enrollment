const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nihu88176",
  database: "yoga_details",
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
  console.log("Connected to database");
});

// Mock CompletePayment function
const CompletePayment = (paid) => {
  // Return success if the user has already paid
  return { success: paid };
};

app.post(
  "/api/submit",
  [
    // Validate the data
    check("name").isLength({ min: 1 }).withMessage("Name is required"),
    check("age")
      .isInt({ min: 18, max: 65 })
      .withMessage("Age must be between 18 and 65"),
    check("batch")
      .isIn(["6-7AM", "7-8AM", "8-9AM", "5-6PM"])
      .withMessage("Batch is invalid"),
    check("paid").isBoolean().withMessage("Payment status is required"),
    check("enrollDate").isISO8601().withMessage("Enrollment date is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, batch, paid, enrollDate } = req.body;
    const payment = paid ? 500 : 0;
    const monthYear = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

    // Check if user is already enrolled in the current month, regardless of the batch
    db.query(
      "SELECT * FROM admissions WHERE name = ? AND monthYear = ?",
      [name, monthYear],
      (err, results) => {
        if (err) {
          console.error("Database query failed:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
          // User is already enrolled in the current month
          return res.status(400).json({
            error: "You are already enrolled for this month.",
          });
        } else {
          // User is not enrolled in the current month. Attempt to complete the payment.
          const paymentResult = CompletePayment(paid);

          if (paymentResult.success) {
            // Payment is successful. Save the user data to the database.
            db.query(
              "INSERT INTO admissions (name, age, batch, payment, enrollDate, monthYear) VALUES (?, ?, ?, ?, ?, ?)",
              [name, age, batch, payment, enrollDate, monthYear],
              (err, result) => {
                if (err) {
                  console.error("Failed to insert data:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                res.json({ message: "Admission successful", paymentResult });
              }
            );
          } else {
            // Payment failed
            return res
              .status(400)
              .json({ error: "Payment failed", paymentResult });
          }
        }
      }
    );
  }
);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
