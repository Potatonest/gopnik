import { nanoid } from 'nanoid';
import { Chatroom } from './Chatroom';
import { Room } from '../models/room';

export class Chatrooms {
    chatrooms: Record<string, Chatroom> = {};

    create() {
        const chatroomId = nanoid(6);
        const room = new Room(chatroomId)
        const chatroom = new Chatroom(room);
        this.chatrooms[chatroomId] = chatroom;

        return chatroom;
    }

    getChatroom(id: string) {
        return this.chatrooms[id];
    }
}