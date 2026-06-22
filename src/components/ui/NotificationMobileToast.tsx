"use client";

import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  Battery, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Bell, 
  Smartphone, 
  X 
} from "lucide-react";
import { getPusherClient } from "@/lib/pusher/pusher-client";
import type { AppNotification } from "@/lib/types/notification";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";

// Play a pleasant simulated smartphone chime using Web Audio API
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Tone 1
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    // Tone 2
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    gain2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.3);
    
    osc2.start(audioCtx.currentTime + 0.1);
    osc2.stop(audioCtx.currentTime + 0.4);
  } catch (err) {
    console.warn("Audio Context failed to initialize (usually user interaction is needed first):", err);
  }
}

export default function NotificationMobileToast() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { theme } = useTheme();
  
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channelName = `user-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handleNewNotification = (newNotif: AppNotification) => {
      // We trigger the smartphone mock popup for specific mobile-related alerts
      if (newNotif.type === "BOOKING_DOCTOR" || newNotif.type === "APPOINTMENT_REMINDER" || newNotif.type === "UNREAD_CHAT") {
        setActiveNotification(newNotif);
        setIsVisible(true);
        setShake(true);
        playChime();
        
        // Vibrate animation stop
        setTimeout(() => setShake(false), 800);
      }
    };

    channel.bind("notification-received", handleNewNotification);

    return () => {
      channel.unbind("notification-received", handleNewNotification);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  // Auto-dismiss notification after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !activeNotification) return null;

  const currentHourString = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "UNREAD_CHAT":
        return <MessageSquare className="h-4 w-4 text-emerald-600" />;
      case "BOOKING_DOCTOR":
        return <Calendar className="h-4 w-4 text-sky-600" />;
      case "APPOINTMENT_REMINDER":
        return <Clock className="h-4 w-4 text-rose-600" />;
      default:
        return <Bell className="h-4 w-4 text-teal-600" />;
    }
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 w-72 sm:w-80 transition-all duration-500 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
      } ${shake ? "animate-bounce" : ""}`}
    >
      {/* Smartphone frame */}
      <div className="w-full overflow-hidden rounded-[38px] border-8 border-slate-900 bg-slate-950 p-1 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-3 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900 z-20" />
        
        {/* Screen container */}
        <div className="relative flex flex-col h-60 w-full overflow-hidden rounded-[30px] bg-slate-900 text-white font-sans">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between px-5 pt-3.5 pb-2 text-[10px] font-bold text-slate-300 z-10 bg-slate-900/40 backdrop-blur-xs">
            <span>{currentHourString}</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3" />
              <Battery className="h-3 w-3" />
            </div>
          </div>

          {/* Screen Content - Lockscreen simulation */}
          <div 
            className="flex-1 flex flex-col justify-start px-3 pt-3 relative bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80')` 
            }}
          >
            {/* Phone Lock Screen Clock */}
            <div className="text-center mb-4">
              <p className="text-2xl font-light tracking-wide text-white">{currentHourString}</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold mt-0.5">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>

            {/* Simulated Notification Toast Pop-up */}
            <div className="relative w-full rounded-2xl bg-white/90 p-3 shadow-lg text-slate-800 backdrop-blur-md border border-white/20 animate-in slide-in-from-top-4 duration-300">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>

              <div className="flex gap-2">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200/50">
                  {getIcon(activeNotification.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-teal-800 uppercase tracking-wider">Verimind</span>
                    <span className="text-[8px] text-slate-400 font-bold">Sekarang</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-900 mt-0.5 truncate">
                    {activeNotification.title}
                  </h4>
                  <p className="text-[9px] text-slate-600 font-medium leading-relaxed mt-0.5 line-clamp-2">
                    {activeNotification.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Smartphone Bottom Bar */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center pointer-events-none">
              <div className="h-1.5 w-24 rounded-full bg-white/70" />
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Visual notification bubble indicator on the side of the screen */}
      <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[8px] font-bold text-white items-center justify-center">1</span>
      </div>
    </div>
  );
}
