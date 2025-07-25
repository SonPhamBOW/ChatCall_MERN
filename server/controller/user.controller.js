import { upsertSreamUser } from "../lib/stream.js";
import User from "../models/User.js";

export const onBoard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, languageLearning, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !languageLearning ||
      !location
    ) {
      return res.status(401).json({
        message: "All field are required!",
        missingField: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !languageLearning && "languageLearning",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        message: "User not found",
      });
    }

    try {
      await upsertSreamUser({
        id: userId.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic,
      });
      console.log(
        "Stream user updated after onboarding: " + updatedUser.fullName
      );
    } catch (error) {
      console.log("Error create Stream user: " + error);
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Boarding user error: " + error,
    });
  }
};

export const getMe = async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
};

export const getRecommendedFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const languageLearning = user.languageLearning;

    const recommendFriends = await User.find({
      languageLearning,
      _id: { $ne: user._id },
    }).select("-password");
    if (!recommendFriends || recommendFriends.length == 0) {
      return res.status(400).json({
        message: "There are no suitable friend",
      });
    }
    res.status(200).json({
      success: true,
      recommendFriends,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Fail to get Recommended Friends: " + error,
    });
  }
};

export const getMyFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage languageLearning"
      );

    res.status(200).json({
      success: true,
      user: user.friends,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Fail to get your Friends: " + error,
    });
  }
};
