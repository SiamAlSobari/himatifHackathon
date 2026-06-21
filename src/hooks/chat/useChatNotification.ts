import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEffect } from "react";


export function useChatNotification(
    userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinished?: (data: any) => void
) {
    useEffect(() => {
        if (!userId) return;

        const pusher = getPusherClient();
        const channelName = `user-${userId}`;
        const channel = pusher.subscribe(channelName);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleEvent = (data: any) => {
            if (onFinished) onFinished(data);
        };

        channel.bind("chat-finished", handleEvent);
        channel.bind("blockchain-synced", handleEvent);

        return () => {
            channel.unbind("chat-finished", handleEvent);
            channel.unbind("blockchain-synced", handleEvent);

            pusher.unsubscribe(
                channelName
            );
        };
    }, [userId, onFinished]);
}