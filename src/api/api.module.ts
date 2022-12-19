import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { UserModule } from "./users/users.module";
import { UserHasDevicesModule } from "./user-has-devices/user-has-devices.module";
import { APP_GUARD } from "@nestjs/core";
import { GqlAuthGuard } from "./auth/auth.guard";
import { UsersGateway } from "./users/users.gateway";

@Module({
    imports  : [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            mockEntireSchema           : false,
            driver                     : ApolloDriver,
            debug                      : false,
            playground                 : false,
            plugins                    : [ApolloServerPluginLandingPageLocalDefault()],
            autoSchemaFile             : "schema.gql",
            installSubscriptionHandlers: true,
            cors                       : {
                credentials: true,
                origin     : true
            }
        }),
        AuthModule,
        UserModule,
        UserHasDevicesModule
    ],
    providers: [{
        provide : APP_GUARD,
        useClass: GqlAuthGuard
    }, UsersGateway]
})
export class ApiModule {
}
