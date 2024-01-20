import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEvent } from "./event.entity";
import { ContractEventService } from "./event.service";
import { ContractEventController } from "./event.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ContractEvent])],
    providers: [ContractEventService],
    controllers: [ContractEventController],
})
export class ContractEventModule {}
