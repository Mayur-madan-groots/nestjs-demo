import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { getEnvPath } from "../../common/helper/env.helper";
import { User } from "./entities/user.entity";
import { Socket } from "socket.io";
import { UnauthorizedException } from "@nestjs/common";

require("dotenv").config({
    path: getEnvPath(__dirname + "/common/envs")
});

export interface CustomSocket extends Socket {
    auth: any;
    user: User;
    user_id: number;
}

@WebSocketGateway(Number(process.env.SOCKET_PORT ?? 3001), {
    cors      : {
        origin: "*"
    },
    transports: ["websocket", "polling"]
})

export class UsersGateway {

    async handleConnection(socket: CustomSocket) {
        console.log("connect");
    }

    handleDisconnect(socket: Socket): any {
        console.log("disconnect");
        socket.removeAllListeners();
        socket.disconnect();
    }

    disconnect(socket: Socket) {
        socket.emit("Error", new UnauthorizedException());
        socket.disconnect();
    }

    @SubscribeMessage("message")
    handleMessage(client: any, payload: any): string {
        return "Hello world!";
    }
}
