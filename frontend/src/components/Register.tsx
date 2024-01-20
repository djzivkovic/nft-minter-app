import Button from "react-bootstrap/Button";
import { contract } from "../utils/constants";
import { provider } from "../utils/ethers";

interface RegisterProps {
    walletAddress: string;
}

const Register: React.FC<RegisterProps> = ({ walletAddress }) => {
    const register = async () => {
        try {
            const price = await contract.registrationPrice();
            const signer = await provider.getSigner();
            const signerContract = contract.connect(signer) as any;
            const options = { value: price };
            const tx = await signerContract.register(options);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    return (
        <div id="register-page">
            <p>Welcome {walletAddress}</p>
            <p>Please register in order to view/mint the NFT collection</p>
            <Button variant="dark" onClick={register}>
                Register
            </Button>
        </div>
    );
};

export default Register;
