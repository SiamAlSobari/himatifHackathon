"use client";

import Navbar from "@/components/ui/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import SummarySidebar from "@/components/chat/SummarySidebar";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher/pusher-client";


export default function ChatPage() {
  const session = useSession();
  useEffect(() => {
    const userId = session.data?.user?.id;
    
    if (!userId) return;
    const pusher = getPusherClient();
    const channelName = `user-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("chat-finished", (data: any) => {
      console.log(data);
      alert("Resume siap!");
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [session.data?.user?.id]);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden px-6 py-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatPanel />
        </div>

        <SummarySidebar />
      </main>
    </div>
  );
}