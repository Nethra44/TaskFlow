import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://taskflow-client-ealh.onrender.com",
    ],
    credentials: true,
  }),
);

app.use(express.json());
// 1. Database Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("🚀 MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 2. Schemas
const UserSchema = new mongoose.Schema({
  // ADDED: name field to store the actual name
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  title: String,
  priority: String,
  category: String,
  dueDate: String,
  dueTime: String,
  status: { type: String, default: "pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});


// 3. Email Config
// 3. Email Config
const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// 3. Email Config
const resend = new Resend(process.env.RESEND_API_KEY);

// 4. Auth Routes
app.post("/api/signup", async (req, res) => {
  try {
    // UPDATED: Capture name from the request body
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // UPDATED: Save name to the database
    const user = await User.create({ name, email, password: hashedPassword });

    // UPDATED: Return name in the response
    res.status(201).json({ userId: user._id, name: user.name });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }
    await resend.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: email,
      subject: "TaskFlow Password Reset",
      html: `
    <div style="font-family:sans-serif;padding:20px">
      <h2>Reset Password</h2>
      <p>Click the button below:</p>

      <a href="${process.env.CLIENT_URL}/reset-password/${user._id}">
        Reset Password
      </a>
    </div>
  `,
    });

    console.log("Email sent:", info);

    return res.json({
      message: "Reset link sent!",
    });
  } catch (err) {
    console.error("Forgot password error:");
    console.error(err);

    return res.status(500).json({
      message: "Email failed to send.",
      error: err.message,
      code: err.code,
      response: err.response,
    });
  }
});

app.put("/api/reset-password/:id", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "Success!" });
  } catch (err) {
    res.status(500).json({ message: "Update failed." });
  }
});

// 5. Task Routes
app.get("/api/tasks/:userId", async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
app.get("/test", (req, res) => {
  res.send("Version 2 - Nethra");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on Port ${PORT}`);
});