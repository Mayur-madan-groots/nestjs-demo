import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UserHasDevicesService } from "../user-has-devices/user-has-devices.service";

export const IS_PUBLIC_KEY = "isPublic";
export const Public        = () => SetMetadata(IS_PUBLIC_KEY, true);

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        return GqlExecutionContext.create(context).getContext().user;
    }
);

export const Token = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req?.headers?.authorization;
    }
);

@Injectable()
export class GqlAuthGuard {

    constructor(
        private auth: AuthService,
        private reflector: Reflector,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private userDeviceService: UserHasDevicesService
    ) {
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) {
            return true;
        }
        const authHeader = context.getArgs()[2]?.req?.headers?.authorization ?? context.getArgs()[1]?.req?.headers?.authorization as string;
        if (!authHeader) {
            throw new BadRequestException("Authorization header not found.");
        }
        // const [type, token] = authHeader.split(' ');
        // if (type !== 'Bearer') {
        //     throw new BadRequestException(`Authentication type 'Bearer' required. Found '${type}'`);
        // }
        const validationResult = await this.auth.ValidateToken(authHeader);
        if (validationResult?.status) {
            const userSession: any = await this.userDeviceService.getUserFromJwt(authHeader);
            if (!userSession || (userSession && !userSession?.user)) {
                throw new UnauthorizedException();
            }
            GqlExecutionContext.create(context).getContext().user = userSession?.user;
            return true;
        }
        throw new UnauthorizedException(validationResult);
    }
}
