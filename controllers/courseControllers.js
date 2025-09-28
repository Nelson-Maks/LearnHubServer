import Course from "../models/course.js";

// CREATE COOURSE (INSTRUCTOR ONLY)
export const createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            instructor: req.user._id,
        });
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json({messgae: error.message})
        
    }
}


// GET ALL COURSE
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name email")
        res.json(courses)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// @desc Update student progress in a course
// @route PUT /api/courses/:id/progress
// @access Private (students only)
export const updateProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    const user = req.user;

    // Find if user is enrolled in this course
    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.course.toString() === courseId
    );

    if (!enrolledCourse) {
      return res.status(404).json({ message: "You are not enrolled in this course" });
    }

    // Update progress
    enrolledCourse.progress = progress;
    await user.save();

    res.json({
      message: "Progress updated successfully",
      courseId,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};