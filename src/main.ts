import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { AuthAdapter } from "./api/adapters/auth.adapter";

async function bootstrap() {
    const app: NestExpressApplication = await NestFactory.create(AppModule);
    const config: ConfigService       = app.get(ConfigService);
    const port: number                = config.get<number>("PORT");

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));

    app.enableCors({
        origin     : true,
        methods    : "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,FETCH",
        credentials: true
    });
    //NOTE: remove comment for redis
    // const redisIoAdapter = new RedisIoAdapter(app);
    // await redisIoAdapter.connectToRedis();
    // app.useWebSocketAdapter(redisIoAdapter);

    //NOTE: remove comment to use authentication in socket
    app.useWebSocketAdapter(new AuthAdapter(app));
    await app.listen(port, () => {
        console.log("[WEB]", config.get<string>("BASE_URL"));
    });
}

bootstrap();
