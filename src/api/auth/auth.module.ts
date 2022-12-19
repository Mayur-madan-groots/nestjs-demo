import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { GqlAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/users.module";
import { UserHasDevicesModule } from "../user-has-devices/user-has-devices.module";

@Module({
    imports  : [
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret     : process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRY }
            })
        }),
        UserModule,
        UserHasDevicesModule
    ],
    providers: [
        GqlAuthGuard,
        AuthService
    ],
    exports  : [
        GqlAuthGuard,
        AuthService
    ]
})

export class AuthModule {
}
