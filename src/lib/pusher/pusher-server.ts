import Pusher from "pusher";
import { envConfig } from "../constants/env";

export const pusherServer = new Pusher({
    appId: envConfig.PusherAppId!,
    key: envConfig.PusherKey!,
    secret: envConfig.PusherSecret!,
    cluster: envConfig.PusherCluster!,
    useTLS: true,
});