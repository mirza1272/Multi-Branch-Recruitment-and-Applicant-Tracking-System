import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const code = "4/0AeoWuM-NXRH6XmVLIrmXdgo5XDJHcTj5itNnxQFO5kho8Y0TL2SyXq4OBJ29GF8GsUCSvA";

async function getRefreshToken() {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ SUCCESS! Here is your Refresh Token:\n");
    console.log(tokens.refresh_token);
    console.log("\nCopy this token and paste it into your .env file as GOOGLE_REFRESH_TOKEN\n");
  } catch (error) {
    console.error("❌ Error fetching tokens:", error.response?.data || error.message);
  }
}

getRefreshToken();
