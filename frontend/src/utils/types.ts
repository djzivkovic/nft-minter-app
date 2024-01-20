export class NftMetadata {
    name: string;
    description: string;
    image: string;
    constructor(name: string, description: string, image: string) {
        this.name = name;
        this.description = description;
        this.image = image;
    }
}

export class Nft {
    id: number;
    metadata: NftMetadata;
    owner: string | null;
    constructor(id: number, metadata: NftMetadata, owner: string | null) {
        this.id = id;
        this.metadata = metadata;
        this.owner = owner;
    }
}
