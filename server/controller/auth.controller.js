import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertSreamUser } from "../lib/stream.js";

export async function signUp(req, res, next) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "All field are required!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // Get a random number from 1 - 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
    });

    try {
      await upsertSreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log("Stream user created for: " + newUser.fullName);
    } catch (error) {
      console.log("Error create Stream user: " + error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack,
      sameSite: "strict", // prevent CSRF attack,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All field are required!",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "Invalid email or password!",
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({
        message: "Invalid email or password!",
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack,
      sameSite: "strict", // prevent CSRF attack,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Error in signin controller" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signOut(req, res, next) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      message: "Sign Out successfully!",
    });
  } catch (error) {
    console.log("Error in signout controller" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
