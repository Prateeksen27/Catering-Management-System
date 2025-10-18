import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Employee from '../models/user.model.js';
import cloudinary from '../middleware/cloudnary.js';

export const register = async (req, res)=>{
  
    
    const { name,email,empType } = req.body;
    try {
        const existingUser = await Employee.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: `${empType} already exists` });
        }
        const newUser = new Employee({ name, email: email, empType: empType });
        await newUser.save();
        res.status(201).json({ message: `${empType} registered successfully` });
    } catch (error) {
        
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req,res)=>{
    const { empID, password,empType } = req.body;
    try{
        const user = await Employee.find({empID,empType});
        console.log(user);
        
        if (!user || user.length === 0) {
            return res.status(404).json({ message: `${empType} with Id ${empID} not found` });
        }
        const isPasswordValid =  bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }   
        const token = jwt.sign({ id: user[0]._id, role: user[0].empType }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user[0]._id,user:user[0] } });
    }catch (error) {
        console.error(`Error during ${empType} login:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateProfile = async (req,res)=>{
  try {
    const id = req.params.id
    const updatedData = req.body;
    const updatedUser = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({success:true,message:"Profile Updated Successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;

    const userId = req.params.id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Find user by ID (use findById, not find)
    const user = await Employee.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile picture
    const updatedUser = await Employee.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
