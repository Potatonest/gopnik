import WebSocket from 'ws';
import { Room } from "../models/Room";

export class Chatroom {
    public websockets: Record<string, WebSocket> = {};

    constructor(public room: Room) {}

    connect(userId: string, ws: WebSocket) {
        this.websockets[userId] = ws;
    }

    disconnect(userId: string) {
        delete this.websockets[userId];
    }
}