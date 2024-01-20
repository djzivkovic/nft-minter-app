import Button from "react-bootstrap/Button";
import { provider } from "../utils/ethers";

interface ConnectWalletProps {
    setConnected: (connected: boolean) => void;
    setWalletAddress: (address: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ setConnected, setWalletAddress }) => {
    const connect = async () => {
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();

        setConnected(true);
        setWalletAddress(_walletAddress);
    };
    return (
        <div id="connect-wallet">
            <Button variant="dark" onClick={connect}>
                Connect Wallet
            </Button>
        </div>
    );
};

export default ConnectWallet;
