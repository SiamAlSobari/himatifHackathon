"use client";

import { useState } from "react";
import ChatHeader from "./ChatHeader";
import DateDivider from "./Datedivider";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  sender: "ai" | "user";
  message: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "ai",
    message:
      "Halo. Saya Teman AI-mu. Berdasarkan hasil screening 'Kenali' yang baru saja kamu selesaikan, sepertinya kamu sedang merasa cukup tertekan minggu ini. Saya di sini untuk mendengarkan. Apa yang paling membebanimu saat ini?",
    time: "09:41",
  },
  {
    id: "2",
    sender: "user",
    message:
      "Iya, saya merasa cemas berlebihan kalau malam hari. Sulit sekali untuk tidur nyenyak.",
    time: "09:43",
  },
  {
    id: "3",
    sender: "ai",
    message:
      "Saya mengerti, kecemasan di malam hari memang sangat melelahkan. Di hasil screening, indikator 'Kecemasan' kamu berada di level sedang. Apakah ada pikiran spesifik yang sering muncul saat kamu mencoba memejamkan mata?",
    time: "09:44",
  },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = (text: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      message: text,
      time,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        <DateDivider label="Hari Ini" />

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            sender={msg.sender}
            message={msg.message}
            time={msg.time}
          />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </section>
  );
}