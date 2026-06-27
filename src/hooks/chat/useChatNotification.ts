import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEffect } from "react";


export function useChatNotification(
    userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinished?: (data: any) => void,
    onChunk?: (data: { sessionId: string; chunk: string }) => void
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

        const handleChunk = (data: { sessionId: string; chunk: string }) => {
            if (onChunk) onChunk(data);
        };

        channel.bind("chat-finished", handleEvent);
        channel.bind("blockchain-synced", handleEvent);
        channel.bind("chat-chunk", handleChunk);

        return () => {
            channel.unbind("chat-finished", handleEvent);
            channel.unbind("blockchain-synced", handleEvent);
            channel.unbind("chat-chunk", handleChunk);

            pusher.unsubscribe(
                channelName
            );
        };
    }, [userId, onFinished, onChunk]);
}