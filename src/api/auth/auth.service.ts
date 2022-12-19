import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) {
    }

    GenerateToken(payload: any) {
        return this.jwtService.sign(payload);
    }

    async ValidateToken(token: string) {
        try {
            return {
                decodeData: await this.jwtService.verify(token),
                status    : true
            };
        } catch (error) {
            return {
                status: false,
                error : error.name
            };
        }
    }
}
