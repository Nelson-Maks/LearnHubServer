import mongoose from "mongoose";
import Course from "./models/course.js";
import dotenv from 'dotenv'


dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for seeding..."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });


const courses = [
    {
        title: "React Basics",
        description: "Learn the fundamentals of React Js including hooks and state"
    }, 

    {
        title: "Node Js Mastery",
        description: "Backend development with Express and MongoDB."
    },

    {
        title: "Tailwind Css",
        description: "Responsive UI design using Tailwind utility classes."
    },

    {
        title: "MERN Stack Full Course",
        description: "Build a complete fullstack project with MongoDB, Express, React, Node."
    }
];


const seedCourse = async ()=>{
    try {
        await Course.insertMany(courses)
        console.log("demo courses inserted")
        process.exit()
    } catch (error) {
        console.error("Error inserting:", error.message)
        process.exit(1)
    }
}

seedCourse()
