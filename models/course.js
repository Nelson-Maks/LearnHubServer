import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: {type: String, required: true},
    description: {type: String},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  },
  { timestamps: true }
)


const Course = mongoose.model("Course", courseSchema);
export default Course;