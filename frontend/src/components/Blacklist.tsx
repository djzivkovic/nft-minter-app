import Button from "react-bootstrap/Button";
import { contract } from "../utils/constants";
import { provider } from "../utils/ethers";
import Form from "react-bootstrap/esm/Form";
import { useState } from "react";

interface BlacklistProps {}

const Blacklist: React.FC<BlacklistProps> = ({}) => {
    const [address, setAddress] = useState<string>("");
    const blacklist = async () => {
        try {
            const signer = await provider.getSigner();
            const signerContract = contract.connect(signer) as any;
            const tx = await signerContract.addToBlacklist(address);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error blacklisting:", error);
        }
    };

    return (
        <div id="blacklist-page" className="mb-4 w-50">
            <p>Blacklist address </p>
            <Form.Control className="w-100" onChange={(e) => setAddress(e.target.value)} />
            <Button variant="dark" className="w-100 mt-2" onClick={blacklist}>
                Blacklist
            </Button>
        </div>
    );
};

export default Blacklist;
