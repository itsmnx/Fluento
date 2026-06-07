import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, prepareChat } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  const { authUser } = useAuthUser();

  const {
    data: tokenData,
    isError: isTokenError,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    retry: 1,
  });

  useEffect(() => {
    let client = null;
    let cancelled = false;

    const initChat = async () => {
      if (!authUser || !targetUserId) return;

      if (!STREAM_API_KEY) {
        setInitError("Stream API key is missing. Add VITE_STREAM_API_KEY to frontend/.env");
        setLoading(false);
        return;
      }

      if (!tokenData?.token) {
        if (isTokenError) {
          setInitError(
            tokenError?.response?.data?.message ||
              "Failed to get chat token. Check backend Stream API keys."
          );
          setLoading(false);
        }
        return;
      }

      try {
        const userId = authUser._id.toString();
        const targetId = targetUserId.toString();

        await prepareChat(targetId);

        client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID && client.userID !== userId) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: userId,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [userId, targetId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [userId, targetId],
        });

        await currChannel.watch();

        if (!cancelled) {
          setChatClient(client);
          setChannel(currChannel);
          setInitError(null);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (!cancelled) {
          const message =
            error?.message || "Could not connect to chat. Please try again.";
          setInitError(message);
          toast.error("Could not connect to chat. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initChat();

    return () => {
      cancelled = true;
      if (client?.userID) {
        client.disconnectUser().catch(() => {});
      }
    };
  }, [tokenData, authUser, targetUserId, isTokenError, tokenError]);

  const handleVideoCall = async () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    try {
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Starting video call...");
      navigate(`/call/${channel.id}`);
    } catch (error) {
      console.error("Error starting video call:", error);
      toast.error("Could not start video call. Try again.");
    }
  };

  if (initError) {
    return (
      <div className="h-[93vh] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-error max-w-md">{initError}</p>
        <p className="text-sm opacity-70 max-w-md">
          Make sure <code className="text-xs">VITE_STREAM_API_KEY</code> in{" "}
          <code className="text-xs">frontend/.env</code> matches{" "}
          <code className="text-xs">STREAM_API_KEY</code> in{" "}
          <code className="text-xs">backend/.env</code>.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex flex-col h-full">
            <div className="flex items-center border-b border-base-300 bg-base-100">
              <div className="flex-1 min-w-0">
                <ChannelHeader />
              </div>
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
            <Window>
              <MessageList />
              <MessageComposer focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
