import { useEffect, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import { injectedProvider, isInjectedProvider } from "../utils/ethers";
import Register from "./Register";
import { contract } from "../utils/constants";
import NftList from "./NftList";
import Blacklist from "./Blacklist";
import { Nft } from "../utils/types";

interface NftPageProps {}

const NftPage: React.FC<NftPageProps> = () => {
    const [connected, setConnected] = useState<boolean | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [blacklisted, setBlacklisted] = useState<boolean | null>(null);
    const [registered, setRegistered] = useState<boolean | null>(null);
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [nfts, setNfts] = useState<Nft[]>([]);

    useEffect(() => {
        const updateAccount = (accounts: string[]) => {
            if (accounts.length > 0) {
                setConnected(true);
                setWalletAddress(accounts[0]);
            } else {
                setConnected(false);
            }
        };
        if (isInjectedProvider) {
            injectedProvider
                .request({ method: "eth_accounts" })
                .then((accounts: string[]) => {
                    updateAccount(accounts);
                })
                .catch((error: unknown) => {
                    console.error(error);
                });

            injectedProvider.on("accountsChanged", (accounts: string[]) => {
                updateAccount(accounts);
            });
        }
        return () => {
            injectedProvider.removeListener("accountsChanged", () => {});
        };
    }, []);

    useEffect(() => {
        if (walletAddress !== "") {
            console.log(contract);
            contract.blacklistedAddresses(walletAddress).then((isBlacklisted: boolean) => {
                setBlacklisted(isBlacklisted);
            });
            contract.registeredAddresses(walletAddress).then((isRegistered: boolean) => {
                setRegistered(isRegistered);
            });
            contract.owner().then((owner: string) => {
                setIsOwner(owner.toLowerCase() === walletAddress.toLowerCase());
            });
        }
    }, [walletAddress]);

    return (
        <div id="nft-page">
            {connected === false && (
                <ConnectWallet setConnected={setConnected} setWalletAddress={setWalletAddress} />
            )}

            {connected === true && blacklisted === true && (
                <p>You have been blacklisted from this NFT collection!</p>
            )}

            {connected === true && blacklisted === false && registered === false && (
                <Register walletAddress={walletAddress} />
            )}

            {connected === true && blacklisted === false && registered === true && (
                <div className="d-flex flex-column align-items-center text-center">
                    {isOwner && nfts.length === 10 && <Blacklist />}
                    <NftList nfts={nfts} setNfts={setNfts} />
                </div>
            )}
        </div>
    );
};

export default NftPage;
