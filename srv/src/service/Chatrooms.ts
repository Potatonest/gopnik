import { nanoid } from 'nanoid';
import { Chatroom } from './Chatroom';
import { Room } from '../models/Room';

export class Chatrooms {
    chatrooms: Record<string, Chatroom> = {};

    create() {
        const chatroomId = nanoid(6);
        const room = new Room(chatroomId)
        const chatroom = new Chatroom(room);
        this.chatrooms[chatroomId] = chatroom;

        return chatroom;
    }

    getChatroom(id: string): Chatroom | undefined {
        return this.chatrooms[id];
    }
}