import { User } from "./models/User";

export namespace RoomApi {
  export interface ConnectRequest {
    reqId: string;
    type: "connect";
    user: User;
    chatroomId: string;
  }

  export interface CreateRequest {
    reqId: string;
    type: "create";
  }

  export interface MessageRequest {
    reqId: string;
    type: "message";
    chatroomId: string;
    message: string;
  }

  export type Request = ConnectRequest | CreateRequest | MessageRequest;

  export interface InitResponse {
    reqId?: undefined;
    type: "init";
    userId: string;
  }

  export interface ConnectResponse {
    reqId: string;
    type: "connected";
  }

  export interface CreateResponse {
    reqId: string;
    type: "created";
    chatroomId: string;
  }

  export interface MessageResponse {
    type: "message";
    user: User;
    message: string;
  }

  export interface ErrorResponse {
    reqId: string;
    type: "error";
    errorMessage: string;
  }

  export type Response = InitResponse | ConnectResponse | CreateResponse | ErrorResponse;
}
