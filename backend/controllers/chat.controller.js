import User from "../models/User.js";
import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";

async function syncUserToStream(user) {
  await upsertStreamUser({
    id: user._id.toString(),
    name: user.fullName,
    image: user.profilePic || "",
  });
}

export async function getStreamToken(req, res) {
  try {
    await syncUserToStream(req.user);

    const token = generateStreamToken(req.user._id);
    if (!token) {
      return res.status(500).json({ message: "Failed to generate chat token. Check Stream API keys." });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function prepareChat(req, res) {
  try {
    const { targetUserId } = req.params;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await syncUserToStream(req.user);
    await syncUserToStream(targetUser);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in prepareChat controller:", error.message);
    res.status(500).json({ message: "Failed to prepare chat session" });
  }
}
