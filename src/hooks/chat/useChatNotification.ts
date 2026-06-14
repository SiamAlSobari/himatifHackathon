import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEffect } from "react";


export function useChatNotification(
    userId?: string,
    onFinished?: (data: any) => void
) {
    useEffect(() => {
        if (!userId) return;

        const pusher = getPusherClient();
        const channelName = `user-${userId}`;
        const channel = pusher.subscribe(channelName);

        channel.bind(
            "chat-finished",
            onFinished || ((data: any) => {})
        );

        return () => {
            channel.unbind(
                "chat-finished",
                onFinished
            );

            pusher.unsubscribe(
                channelName
            );
        };
    }, [userId, onFinished]);
}