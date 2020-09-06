import Websocket from "ws";
import { Chatrooms } from "../service/Chatrooms";
import { nanoid } from "nanoid";
import { Chatroom } from "../service/Chatroom";
import { assertNever } from "../util";
import { RoomApi } from "../request";

const chatrooms = new Chatrooms();

type Request = RoomApi.Request;
type Response = RoomApi.Response;

class RoomController {
  protected connectedChatrooms: Map<string, Chatroom> = new Map();

  constructor(public ws: Websocket, public userId: string) {
    this.init()
  }

  init() {
    this.send({
      type: "init",
      userId: this.userId,
    });
  }

  connect(request: RoomApi.ConnectRequest) {
    request.user.id = this.userId;
    const chatroom = chatrooms.getChatroom(request.chatroomId);

    if (chatroom) {
      this.connectedChatrooms.set(chatroom.room.id, chatroom);
      chatroom.connect(this.userId, this.ws);

      this.send({ reqId: request.reqId, type: "connected" });
    } else {
      this.send({
        type: "error",
        reqId: request.reqId,
        errorMessage: "Chatroom does not exist",
      });
    }
  }

  create(request: RoomApi.CreateRequest) {
    const chatroom = chatrooms.create();
    this.send({
      type: "created",
      reqId: request.reqId,
      chatroomId: chatroom.room.id,
    });
  }

  message(request: RoomApi.MessageRequest) {
    const chatroom = this.connectedChatrooms.get(request.chatroomId);
    if (chatroom) {
      const user = chatroom.room.getUser(this.userId);
      const message: RoomApi.MessageResponse = {
        type: 'message',
        user,
        message: request.message
      }
      const messageStr = JSON.stringify(message);
      
      for (const [wsId, ws] of Object.entries(chatroom.websockets)) {
        if (wsId !== this.userId) {
          ws.send(messageStr);
        }
      }
    } else {
      this.send({
        type: "error",
        reqId: request.reqId,
        errorMessage: "Unknown chatroom",
      });
    }
  }

  send(response: Response) {
    this.ws.send(JSON.stringify(response));
  }

  close() {
    for (const chatroom of this.connectedChatrooms.values()) {
      chatroom.disconnect(this.userId);
    }
    this.connectedChatrooms.clear();
  }

  handleRequest(request: Request) {
    switch (request.type) {
      case "connect": {
        this.connect(request);
        break;
      }
      case "create": {
        this.create(request);
        break;
      }
      case "message": {
        this.message(request);
        break;
      }
      default: {
        assertNever(request);
        this.send({
          type: "error",
          reqId: (request as any).reqId,
          errorMessage: `Unknown request ${(request as any).type}`,
        });
        break;
      }
    }
  }
}

export const room = (ws: Websocket) => {
  const controller = new RoomController(ws, nanoid(20));
  console.log("User:", controller.userId, "connected");

  ws.addEventListener("close", () => {
    controller.close();
    console.log("User:", controller.userId, "disconnected");
  });

  ws.addEventListener("message", (e) => {
    try {
      controller.handleRequest(JSON.parse(e.data));
    } catch (e) {
      console.error(e);
    }
  });
};
