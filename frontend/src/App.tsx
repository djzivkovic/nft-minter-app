import React, { useEffect, useState } from "react";
import "./App.css";
import { injectedProvider, isInjectedProvider, provider } from "./utils/ethers";
import NftPage from "./components/NftPage";
import { chainId } from "./utils/constants";

function App() {
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean | null>(null);
    const [selectedChainId, setSelectedChainId] = useState<bigint | null>(null);

    useEffect(() => {
        setIsMetamaskInstalled(isInjectedProvider);
        if (isInjectedProvider) {
            provider
                .getNetwork()
                .then((network) => {
                    setSelectedChainId(BigInt(network.chainId));
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
            injectedProvider.on("chainChanged", (chainId: string) => {
                setSelectedChainId(BigInt(chainId));
            });
            return () => {
                provider.removeListener("network", () => {});
            };
        } else {
            setSelectedChainId(BigInt(-1));
        }
    }, []);

    useEffect(() => {
        if (
            selectedChainId !== null &&
            selectedChainId !== BigInt(chainId) &&
            selectedChainId !== BigInt(-1)
        ) {
            injectedProvider
                .request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x" + chainId.toString(16) }],
                })
                .then(() => {
                    setSelectedChainId(BigInt(chainId));
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }
    }, [selectedChainId]);

    if (isMetamaskInstalled === null || selectedChainId === null) {
        return (
            // return empty if metamask and chainId are not yet loaded
            <></>
        );
    }

    return (
        <div className="App">
            <div id="nft-app" className="d-flex flex-column align-items-center w-75 text-center">
                {!isMetamaskInstalled && (
                    <div className="alert alert-danger" role="alert">
                        Please install Metamask
                    </div>
                )}
                {isMetamaskInstalled && selectedChainId !== BigInt(chainId) && (
                    <div className="alert alert-danger" role="alert">
                        Please switch to Ethereum Goerli
                    </div>
                )}
                {isMetamaskInstalled && selectedChainId === BigInt(chainId) && <NftPage />}
            </div>
        </div>
    );
}

export default App;
