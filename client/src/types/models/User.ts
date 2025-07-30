export interface User {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic: string;
  nativeLanguage: string;
  languageLearning: string;
  location: string;
  isOnBoarded: boolean;
  friends: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSignInType {
  email: string;
  password: string;
}

export interface UserOnboardingType {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  languageLearning: string;
  location: string;
  profilePic: string;
}
