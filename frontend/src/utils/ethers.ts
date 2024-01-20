import { ethers } from "ethers";

export const injectedProvider = (window as any)?.ethereum;
export const isInjectedProvider = typeof injectedProvider !== "undefined";
export const provider = new ethers.BrowserProvider(injectedProvider);
