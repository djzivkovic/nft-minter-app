import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ContractEvent {
    @PrimaryColumn()
    transactionHash: string;
    @PrimaryColumn()
    index: number;
    @Column()
    blockNumber: number;
    @Column()
    name: string;
    @Column()
    address: string;
    @Column({ nullable: true })
    tokenId: number;
    @Column()
    rawData: string;
}
