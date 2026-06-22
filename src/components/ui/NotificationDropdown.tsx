"use client";

import React, { useRef, useEffect } from "react";
import { 
  Bell, 
  Check, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Sparkles, 
  Inbox, 
  ExternalLink 
} from "lucide-react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/useNotifications";
import type { AppNotification } from "@/lib/types/notification";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeStyles = {
  calm_blue: {
    text: "text-teal-900",
    bg: "bg-teal-50",
    border: "border-teal-200/50",
    accentBg: "bg-teal-100/60",
    accentText: "text-teal-700",
    badge: "bg-teal-600 text-white",
    hover: "hover:bg-teal-50/50",
    bullet: "bg-teal-600",
    tipsBg: "bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border border-teal-100/40",
    tip: "Fokus pada napas Anda. Coba latihan napas kotak 4-7-8 untuk menenangkan detak jantung saat cemas."
  },
  warm_yellow: {
    text: "text-amber-900",
    bg: "bg-amber-50",
    border: "border-amber-200/50",
    accentBg: "bg-amber-100/60",
    accentText: "text-amber-700",
    badge: "bg-amber-600 text-white",
    hover: "hover:bg-amber-50/50",
    bullet: "bg-amber-600",
    tipsBg: "bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-100/40",
    tip: "Aktivitas menulis jurnal rasa syukur membantu mengalihkan pikiran Anda dari kekhawatiran yang tidak perlu."
  },
  alert_orange: {
    text: "text-orange-950",
    bg: "bg-orange-50",
    border: "border-orange-200/50",
    accentBg: "bg-orange-100/60",
    accentText: "text-orange-700",
    badge: "bg-orange-600 text-white",
    hover: "hover:bg-orange-50/50",
    bullet: "bg-orange-600",
    tipsBg: "bg-gradient-to-br from-orange-50/60 to-red-50/40 border border-orange-100/40",
    tip: "Bila stres meningkat, luangkan waktu 5 menit untuk melakukan peregangan otot lengan dan leher."
  },
  deep_purple: {
    text: "text-indigo-950",
    bg: "bg-indigo-50",
    border: "border-indigo-200/50",
    accentBg: "bg-indigo-100/60",
    accentText: "text-indigo-700",
    badge: "bg-indigo-600 text-white",
    hover: "hover:bg-indigo-50/50",
    bullet: "bg-indigo-600",
    tipsBg: "bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100/40",
    tip: "Ucapkan afirmasi positif dalam hati: 'Saya berharga, saya tenang, dan saya memegang kendali atas emosi saya'."
  }
};

function NotificationItem({ 
  notification, 
  styles, 
  onClick 
}: { 
  notification: AppNotification; 
  styles: typeof themeStyles.calm_blue;
  onClick: () => void;
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case "UNREAD_CHAT":
        return <MessageSquare className={`h-4.5 w-4.5 ${styles.accentText}`} />;
      case "BOOKING_DOCTOR":
        return <Calendar className={`h-4.5 w-4.5 ${styles.accentText}`} />;
      case "APPOINTMENT_REMINDER":
        return <Clock className={`h-4.5 w-4.5 ${styles.accentText}`} />;
      default:
        return <Bell className={`h-4.5 w-4.5 ${styles.accentText}`} />;
    }
  };

  const formattedDate = new Date(notification.createdAt).toLocaleDateString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short"
  });

  return (
    <div 
      onClick={onClick}
      className={`relative flex gap-3 px-4 py-3.5 border-b border-slate-50 transition-colors cursor-pointer ${
        !notification.read ? `${styles.hover} bg-slate-50/40` : "hover:bg-slate-50/30"
      }`}
    >
      {!notification.read && (
        <div className={`absolute top-4 right-4 h-2 w-2 rounded-full ${styles.bullet}`} />
      )}
      
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.accentBg}`}>
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold text-slate-800 truncate`}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 font-medium leading-relaxed break-words">
          {notification.message}
        </p>
        <span className="mt-1 block text-[10px] text-slate-400 font-medium">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ styles }: { styles: typeof themeStyles.calm_blue }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.bg} ${styles.accentText} mb-3`}>
        <Inbox className="h-6 w-6" />
      </div>
      <p className="text-xs font-bold text-slate-700">Kotak Masuk Bersih</p>
      <p className="mt-1 text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
        Tidak ada notifikasi baru untuk Anda saat ini.
      </p>
    </div>
  );
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { theme } = useTheme();
  const styles = themeStyles[theme] || themeStyles.calm_blue;
  const router = useRouter();

  const { data: notifications = [] } = useNotifications(userId);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (notif: AppNotification) => {
    // 1. Mark as read if not already
    if (!notif.read) {
      markAsReadMutation.mutate(notif.id);
    }

    // 2. Parse metaData safely
    let meta: any = null;
    if (notif.metaData) {
      if (typeof notif.metaData === "string") {
        try {
          meta = JSON.parse(notif.metaData);
        } catch (e) {
          console.error("Failed to parse notification metadata", e);
        }
      } else {
        meta = notif.metaData;
      }
    }

    const isPsychologist = (session?.user as any)?.role === "PSYCHOLOGY";

    // 3. Redirect logic based on type
    if (notif.type === "UNREAD_CHAT" || notif.type === "APPOINTMENT_REMINDER") {
      const appointmentId = meta?.appointmentId;
      if (appointmentId) {
        if (isPsychologist) {
          router.push(`/psikolog/konsultasi?appointmentId=${appointmentId}`);
        } else {
          router.push(`/konsultasi?appointmentId=${appointmentId}`);
        }
      } else {
        router.push(isPsychologist ? "/psikolog/konsultasi" : "/konsultasi");
      }
    } else if (notif.type === "BOOKING_DOCTOR") {
      if (isPsychologist) {
        router.push("/psikolog");
      } else {
        router.push("/riwayatkonsultasi");
      }
    }

    // 4. Close dropdown
    onClose();
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles.badge}`}>
              {unreadCount} Baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              styles={styles}
              onClick={() => handleItemClick(notif)}
            />
          ))
        ) : (
          <EmptyState styles={styles} />
        )}
      </div>

      {/* Footer - Tips section to minimize empty space and provide related info */}
      <div className={`p-4 border-t border-slate-100 bg-slate-50/50`}>
        <div className={`rounded-xl p-3.5 ${styles.tipsBg}`}>
          <div className="flex gap-2 items-center mb-1">
            <Sparkles className={`h-4 w-4 ${styles.accentText}`} />
            <h4 className={`text-xs font-bold ${styles.text}`}>Tips Kesejahteraan</h4>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {styles.tip}
          </p>
          <div className="mt-2.5 flex justify-between items-center border-t border-slate-100/50 pt-2">
            <Link 
              href="/dashboard" 
              onClick={onClose}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              Lihat Rekomendasi
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
