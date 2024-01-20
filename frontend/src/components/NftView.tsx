import Button from "react-bootstrap/Button";
import { Nft } from "../utils/types";
import { contract } from "../utils/constants";
import { provider } from "../utils/ethers";
import { truncateString } from "../utils/helpers";

interface NftViewProps {
    nft: Nft;
}

const NftView: React.FC<NftViewProps> = ({ nft }) => {
    const mint = async () => {
        const price = await contract.mintPrice();
        const signer = await provider.getSigner();
        const signerContract = contract.connect(signer) as any;
        const options = { value: price };
        const tx = await signerContract.mintNFT(nft.id, options);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            window.location.reload();
        }
    };
    return (
        <div className="nft-view p-1">
            <img src={nft.metadata.image} alt={nft.metadata.name} className="img-fluid" />
            <h3>{nft.metadata.name}</h3>
            <p>{nft.metadata.description}</p>
            {nft.owner && (
                <a href={"https://sepolia.etherscan.io/address/" + nft.owner}>
                    {truncateString(nft.owner, 8, 6)}
                </a>
            )}
            {!nft.owner && (
                <Button className="w-100" variant="dark" onClick={mint}>
                    Mint
                </Button>
            )}
        </div>
    );
};

export default NftView;
