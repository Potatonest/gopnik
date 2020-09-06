import { User } from "./User";

export class Room {
    protected users: Record<string, User> = {};

    constructor(public id: string) {}
    
    getUser(id: string) {
        return this.users[id];
    }

    addUser(user: User) {
        this.users[user.id] = user;
    }

    removeUser(id: string) {
        delete this.users[id];
    }
}