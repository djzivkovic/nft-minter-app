import { Expose } from "class-transformer";

export class ContractEventDto {
    @Expose()
    transactionHash: string;
    @Expose()
    blockNumber: number;
    @Expose()
    name: string;
    @Expose()
    address: string;
    @Expose()
    tokenId: number;
}
