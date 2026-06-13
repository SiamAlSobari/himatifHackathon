"use client";

import Navbar from "@/components/ui/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import SummarySidebar from "@/components/chat/SummarySidebar";

export default function ChatPage() {
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