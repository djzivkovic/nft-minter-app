import { Controller, Get, Query } from "@nestjs/common";
import { ContractEventService } from "./event.service";
import { ContractEventDto } from "./event.dto";

@Controller("contract-event")
export class ContractEventController {
    constructor(private readonly contractEventService: ContractEventService) {}

    @Get("/")
    async getEvents(
        @Query("address") address: string,
        @Query("event") event: string,
    ): Promise<ContractEventDto[]> {
        return this.contractEventService.getEvents(address, event);
    }
}
