import { IoAdapter } from "@nestjs/platform-socket.io";
import { Socket } from "socket.io";
import { INestApplicationContext, Inject } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { UserHasDevicesService } from "../user-has-devices/user-has-devices.service";

export interface CustomSocket extends Socket {
    user: User;
}

export class AuthAdapter extends IoAdapter {
    @Inject(UserHasDevicesService)
    private userDeviceService: UserHasDevicesService;

    constructor(private app: INestApplicationContext) {
        super(app);
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.use(async (socket: CustomSocket, next) => {
            const token = socket.handshake.headers.authorization ?? socket.handshake.auth.authorization;
            if (token) {
                const userSession = await this.userDeviceService.getUserFromJwt(token);
                if (!userSession || (userSession && !userSession?.user)) {
                    next(new Error("Authentication error"));
                    return;
                }
                socket.user = userSession.user;
                next();
            } else {
                next(new Error("Authentication error"));
            }
        });
        return server;
    }
}
