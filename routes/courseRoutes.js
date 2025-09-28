import express from "express";
import Course from "../models/course.js";
import protect from "../middleware/authMiddle.js";
import adminMiddleware from "../middleware/adminMiddleWare.js";
import { updateProgress } from "../controllers/courseControllers.js";

const router = express.Router();

// Get all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course (admins only)
router.post("/", protect, adminMiddleware, async (req, res) => {
  const { title, description } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id, // admin who created it
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in a course (students)
// routes/courseRoutes.js
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const isEnrolled = req.user.enrolledCourses.some(
      (c) => c.course.toString() === course._id.toString()
    );
    if (isEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // Add to student's enrolled courses
    req.user.enrolledCourses.push({ course: course._id, progress: 0 });
    await req.user.save();

    // Also add student to course
    course.students.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update progress
router.put("/:id/progress", protect, updateProgress);

export default router;

