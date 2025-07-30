import { axiosInstance } from "../lib/axios";
import type {
  User,
  UserOnboardingType,
  UserSignInType,
} from "../types/models/User.js";

export const signIn = async (signinData: UserSignInType) => {
  const res = await axiosInstance.post("/auth/signin", signinData);
  return res.data;
};

export const signOut = async () => {
  const res = await axiosInstance.post("/auth/signout");
  return res.data;
};

export const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const completeOnboarding = async (user: UserOnboardingType) => {
  const res = await axiosInstance.post("/auth/onboarding", user);
  return res.data;
};

export const getUserFriends = async (): Promise<[User]> => {
  const res = await axiosInstance.get("/friends");
  return res.data;
};

export const getRecommendUsers = async (): Promise<[User]> => {
  const res = await axiosInstance.get("/recommend");
  return res.data.recommendFriends;
};

export const sendFriendRequest = async (userId: string) => {
  const res = await axiosInstance.post(`/friend-request/${userId}`);
  return res.data;
};

export const acceptFriendRequest = async (userId: string) => {
  const res = await axiosInstance.put(`/friend-request/${userId}/accept`);
  return res.data;
};

export const getOutgoingFriendRequest = async () => {
  const res = await axiosInstance.get(`/outgoing-friend-request`);
  return res.data;
};
