import WebSocket from 'ws';
import { Room } from "../models/room";

export class Chatroom {
    public websockets: Record<string, WebSocket> = {};

    constructor(public room: Room) {}

    connect(userId: string, ws: WebSocket) {
        this.websockets[userId] = ws;
    }

    disconnect(userId: string) {
        delete this.websockets[userId];
    }

    broadcast(userId: string, message: string) {
        const user = this.room.getUser(userId);
        for (const ws of Object.values(this.websockets)) {
            ws.send(JSON.stringify({ user, message }));
        }
    }
}