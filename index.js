const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoute.js");
const app = express();
const bodyParser = require("body-parser");
const questionsData = require("./questions.json");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// mongo db connnection



mongoose
  .connect("mongodb+srv://rohin:rohin@cluster0.rlttgvn.mongodb.net/")
  .then(() => console.log("connected to mongo"))
  .catch((error) => console.error("failed to connect to mongo db", error));

//route

app.use("/api/auth", authRouter);

//global error handler

app.use((err, res, req, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Define Mongoose schema for questions
const QuestionSchema = new mongoose.Schema({
  questionText: String,
  class: Number,
  answerOptions: [{ answerText: String, isCorrect: Boolean }],
});

const Question = mongoose.model("Question", QuestionSchema);

// GET endpoint to retrieve questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// (Optional) Seed data only if the collection is empty
const seedData = async () => {
  try {
    const existingQuestions = await Question.find();
    if (existingQuestions.length === 0) {
      await Question.insertMany(questionsData);
      console.log("Questions seeded successfully");
    }
  } catch (err) {
    console.error(err);
  }
};

seedData();  // Call the seeding function 

app.get("/api/question", (req, res) => {

  res.json(questionsData);
});

// mongo db server

app.listen(PORT, () => {
  console.log("server is running", PORT);
});

