import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose
  .connect("mongodb://localhost:27017/taskflow")
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

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// 3. Email Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "xxxx xxxx xxxx xxxx",
  },
});

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
    res.status(400).json({ message: "Account already exists." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // UPDATED: Include the name in the login response
      res.status(200).json({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error during login." });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found." });

    const mailOptions = {
      from: '"TaskFlow Support" <your-email@gmail.com>',
      to: email,
      subject: "TaskFlow Password Reset",
      html: `<div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:20px;">
              <h2>Reset Password</h2>
              <p>Click below to reset your TaskFlow password:</p>
              <a href="http://localhost:5173/reset-password/${user._id}" 
                 style="background:#0f172a;color:white;padding:12px 20px;text-decoration:none;border-radius:10px;display:inline-block;">
                Reset Password
              </a>
             </div>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset link sent!" });
  } catch (err) {
    res.status(500).json({ message: "Email failed to send." });
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

app.listen(5000, () => console.log("🚀 Server running on Port 5000"));
