import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";


// REGISTRATION
export const registerUser = async(req, res)=>{
    const {name, email, password, role} = req.body
    try {
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    
    const user = await User.create({name, email, password: hashed, role})

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"})

    res.status(201).json({id: user._id, name: user.name, email: user.email, role: user.role, token})
} catch (error) {
    res.status(500).json({message: error.message})
}
}



// LOGIN
export const loginUser = async (req, res) => {
    const {email, password} = req.body
    
    try {        
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid Credentials"})

        const match = await bcrypt.compare(password, user.password)  
        if(!match) return res.status(400).json({message: "Invalid Credentials"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"})

        res.json({ id: user._id, name: user.name, email: user.email, role: user.role, token});       
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password") // don’t send password back
      .populate("enrolledCourses.course"); // get full course details

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};