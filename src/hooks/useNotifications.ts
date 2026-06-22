import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppNotification } from "@/lib/types/notification";
import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEffect } from "react";

export function useNotifications(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<AppNotification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch notifications");
      return json.data;
    },
    enabled: !!userId,
  });

  // Set up real-time listener for live updates
  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channelName = `user-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handleNewNotification = (newNotif: AppNotification) => {
      // Update React Query Cache immediately
      queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) => {
        // Prevent duplicate push events
        if (old.some((n) => n.id === newNotif.id)) return old;
        return [newNotif, ...old];
      });
    };

    channel.bind("notification-received", handleNewNotification);

    return () => {
      channel.unbind("notification-received", handleNewNotification);
      pusher.unsubscribe(channelName);
    };
  }, [userId, queryClient]);

  return query;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update notification");
      return json.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<AppNotification[]>(["notifications"]);

      queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark all notifications as read");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update notifications");
      return json.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<AppNotification[]>(["notifications"]);

      queryClient.setQueryData<AppNotification[]>(["notifications"], (old = []) =>
        old.map((n) => ({ ...n, read: true }))
      );

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useSimulateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { type: string; title?: string; message?: string }) => {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to simulate notification");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to simulate");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
