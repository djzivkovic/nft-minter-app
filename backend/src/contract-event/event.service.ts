import { Injectable } from "@nestjs/common";
import { contract } from "./constants";
import { ContractEventPayload } from "ethers";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { ContractEvent } from "./event.entity";
import { ContractEventDto } from "./event.dto";
import { FindOptionsWhere, ILike } from "typeorm";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ContractEventService {
    constructor(
        @InjectRepository(ContractEvent)
        private eventRepository: Repository<ContractEvent>,
    ) {}

    async getEvents(address: string, event: string): Promise<ContractEventDto[]> {
        const where: FindOptionsWhere<ContractEvent> = {};

        if (address) where.address = ILike(`%${address}%`);
        if (event) where.name = ILike(`%${event}%`);

        const results = await this.eventRepository.find({
            where,
        });
        return results.map((result) => {
            return plainToInstance(ContractEventDto, result, { excludeExtraneousValues: true });
        });
    }

    async addEvent(
        name: string,
        address: string,
        tokenId: number,
        event: ContractEventPayload,
    ): Promise<void> {
        const eventEntity = new ContractEvent();
        eventEntity.transactionHash = event.log.transactionHash;
        eventEntity.index = event.log.index;
        eventEntity.blockNumber = event.log.blockNumber;
        eventEntity.name = name;
        eventEntity.address = address;
        if (tokenId) eventEntity.tokenId = tokenId;
        eventEntity.rawData = JSON.stringify(event.log);
        this.eventRepository.save(eventEntity);
    }

    async onModuleInit(): Promise<void> {
        contract.on(
            "NFTMinted",
            (address: string, tokenId: number, event: ContractEventPayload) => {
                this.addEvent("NFTMinted", address, tokenId, event);
            },
        );
        contract.on("AddressBlacklisted", (address: string, event: ContractEventPayload) => {
            this.addEvent("AddressBlacklisted", address, null, event);
        });
        contract.on("AddressRegistered", (address: string, event: ContractEventPayload) => {
            this.addEvent("AddressRegistered", address, null, event);
        });
    }
}
