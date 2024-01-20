import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEvent } from "./contract-event/event.entity";
import { ContractEventModule } from "./contract-event/event.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "postgres",
            database: process.env.DB_NAME || "postgres",
            entities: [ContractEvent],
            synchronize: true,
        }),
        ContractEventModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
