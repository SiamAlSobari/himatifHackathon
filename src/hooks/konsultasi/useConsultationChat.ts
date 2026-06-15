import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusher/pusher-client";
import { Message } from "@/lib/types/konsultasi";

export function useConsultationChat(
  appointmentId: string | undefined,
  role: "user" | "psychologist"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch initial messages
  useEffect(() => {
    if (!appointmentId) {
      setIsMessagesLoading(false);
      return;
    }

    async function fetchMessages() {
      try {
        setIsMessagesLoading(true);
        const res = await fetch(`/api/konsultasi/messages?appointmentId=${appointmentId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const uiMessages = json.data.map((m: any) => ({
              id: m.id,
              sender: m.sender as "user" | "psychologist",
              text: m.text,
              time: new Date(m.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            }));
            setMessages(uiMessages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setIsMessagesLoading(false);
      }
    }

    fetchMessages();
  }, [appointmentId]);

  // Broadcast presence helper function
  const sendPresence = async (type: "join" | "greet" | "leave") => {
    if (!appointmentId) return;
    try {
      await fetch("/api/konsultasi/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          role,
          type,
        }),
      });
    } catch (err) {
      console.error("Failed to send presence:", err);
    }
  };

  // 2. Pusher subscriptions for real-time messages, typing, and presence updates
  useEffect(() => {
    if (!appointmentId) return;

    const pusher = getPusherClient();
    const channelName = `appointment-${appointmentId}`;
    const channel = pusher.subscribe(channelName);

    // Message sent binding
    const handleNewMessage = (newMessage: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [
          ...prev,
          {
            id: newMessage.id,
            sender: newMessage.sender as "user" | "psychologist",
            text: newMessage.text,
            time: new Date(newMessage.createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          },
        ];
      });
    };

    // Typing status binding
    const handleTypingStatus = (data: { sender: string; isTyping: boolean }) => {
      if (data.sender !== role) {
        setIsTyping(data.isTyping);
      }
    };

    // Presence status binding
    const handlePresenceStatus = (data: { type: "join" | "greet" | "leave"; sender: string }) => {
      if (data.sender !== role) {
        if (data.type === "join") {
          setIsOnline(true);
          // Greet back so they know we are already online
          sendPresence("greet");
        } else if (data.type === "greet") {
          setIsOnline(true);
        } else if (data.type === "leave") {
          setIsOnline(false);
        }
      }
    };

    channel.bind("message-sent", handleNewMessage);
    channel.bind("typing-status", handleTypingStatus);
    channel.bind("presence-status", handlePresenceStatus);

    // Announce we joined
    sendPresence("join");

    return () => {
      // Announce we left
      sendPresence("leave");
      channel.unbind("message-sent", handleNewMessage);
      channel.unbind("typing-status", handleTypingStatus);
      channel.unbind("presence-status", handlePresenceStatus);
      pusher.unsubscribe(channelName);
    };
  }, [appointmentId, role]);

  // 3. Broadcast typing status helper
  const sendTypingStatus = async (status: boolean) => {
    if (!appointmentId) return;
    try {
      await fetch("/api/konsultasi/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          sender: role,
          isTyping: status,
        }),
      });
    } catch (err) {
      console.error("Failed to broadcast typing status:", err);
    }
  };

  // 4. Handle text change in input (with typing status debounce)
  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (!appointmentId) return;

    if (typingTimeoutRef.current === null) {
      sendTypingStatus(true);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  };

  // 5. Send message action
  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || !appointmentId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    sendTypingStatus(false);

    try {
      setInputValue("");
      const res = await fetch("/api/konsultasi/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          sender: role,
          text,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setInputValue(text);
    }
  };

  return {
    messages,
    isOnline,
    isTyping,
    inputValue,
    isMessagesLoading,
    setInputValue: handleInputChange,
    sendMessage,
  };
}
