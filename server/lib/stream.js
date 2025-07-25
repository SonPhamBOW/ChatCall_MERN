import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiKeySecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiKeySecret) {
  console.error();
}

const streamClient = StreamChat.getInstance(apiKey, apiKeySecret);

export const upsertSreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData
  } catch (error) {
    console.log("Error userData streamClient upsertUser" + error);
  }
};

export const generateStreamToken = (userId) => {

}