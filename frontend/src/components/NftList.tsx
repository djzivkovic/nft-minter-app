import { useEffect, useState } from "react";
import { contract } from "../utils/constants";
import { Nft, NftMetadata } from "../utils/types";
import NftView from "./NftView";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

interface NftListProps {
    nfts: Nft[];
    setNfts: React.Dispatch<React.SetStateAction<Nft[]>>;
}

const NftList: React.FC<NftListProps> = ({ nfts, setNfts }) => {
    let ignore = false;

    const fetchNfts = async () => {
        const gateway = process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/";
        const originalBaseURI: string = await contract.baseURI();
        const baseURI = gateway + originalBaseURI.replace("ipfs://", gateway);
        const maxSupply: number = await contract.maxSupply();
        for (let id = 0; id < maxSupply; id++) {
            const metadataURI = baseURI + "/" + id.toString() + ".json";
            const res = await fetch(metadataURI);
            const metadata: NftMetadata = await res.json();
            let owner: string | null;
            try {
                owner = await contract.ownerOf(id);
            } catch (error) {
                owner = null;
            }

            setNfts((nfts) =>
                [
                    ...nfts,
                    new Nft(
                        id,
                        {
                            name: metadata.name,
                            description: metadata.description,
                            image: gateway + metadata.image.replace("ipfs://", ""),
                        },
                        owner
                    ),
                ].sort((a, b) => a.id - b.id)
            );
        }
    };

    useEffect(() => {
        if (ignore) return;
        fetchNfts();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div>
            <div id="nft-list" className="d-flex align-content-around flex-wrap w-100">
                {nfts.length === 10 && nfts.map((nft) => <></>)}
                {nfts.length < 10 && (
                    <Container>
                        <Row>
                            <div className="spinner-border text-dark" role="status" />
                        </Row>
                    </Container>
                )}
            </div>
        </div>
    );
};

export default NftList;
